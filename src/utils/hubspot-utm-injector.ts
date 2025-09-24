export const hubspotUtmInjector = () => {
  // ===== Guard: run only on pages that may contain HubSpot forms =====
  const HUBSPOT_FORM_SELECTORS = [
    'form.hsfc-Form',
    'form.hs-form',
    '.hubspot-embed-form',
    '.hubspot-embed-form-v2'
  ];

  const hasAnyHubspotContainer = () =>
    HUBSPOT_FORM_SELECTORS.some((sel) => !!document.querySelector(sel));

  // If neither forms nor wrappers exist now, still set up observer to catch late renders

  // ===== UTM setup =====
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
  type UtmKey = (typeof UTM_KEYS)[number];
  type UtmMap = Partial<Record<UtmKey, string>>;

  const LS_KEY = '__utm_cache';
  const LS_TTL_DAYS = 90;

  // Console logging disabled for production
  const log = {
    info: () => {},
    warn: () => {},
    group: () => {},
    groupEnd: () => {},
  };

  const getUtmFromUrl = (): UtmMap => {
    const out: UtmMap = {};
    try {
      const params = new URLSearchParams(window.location.search);
      UTM_KEYS.forEach((k) => {
        const v = params.get(k);
        if (v) out[k] = v;
      });
    } catch {
      // noop
    }
    return out;
  };

  const readCache = (): { data: UtmMap; ts: number } => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { data: {}, ts: 0 };
      const parsed = JSON.parse(raw) as { data?: UtmMap; ts?: number };
      if (!parsed || !parsed.data) return { data: {}, ts: 0 };
      const ageDays = (Date.now() - (parsed.ts || 0)) / 86400000;
      if (ageDays > LS_TTL_DAYS) return { data: {}, ts: 0 };
      return { data: parsed.data || {}, ts: parsed.ts || 0 };
    } catch {
      return { data: {}, ts: 0 };
    }
  };

  const writeCache = (data: UtmMap) => {
    try {
      if (!data || !Object.keys(data).length) return;
      localStorage.setItem(LS_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch {
      // noop
    }
  };

  const urlUtm = getUtmFromUrl();
  const cachedUtm = readCache().data || {};
  const utm: UtmMap = { ...cachedUtm, ...urlUtm };
  if (Object.keys(urlUtm).length) writeCache(utm);

  log.info('Booting. UTM resolved:', utm);

  // ===== Helpers to detect HubSpot forms =====
  const isHubspotForm = (el: Element | null): el is HTMLFormElement => {
    if (!el) return false as const;
    if (el.matches('form.hsfc-Form, form.hs-form')) return true as const;
    return false as const;
  };

  const findCandidateForms = (root: ParentNode | Document): HTMLFormElement[] => {
    const direct = Array.from(root.querySelectorAll('form.hsfc-Form, form.hs-form')) as HTMLFormElement[];
    const wrappers = Array.from(
      root.querySelectorAll('.hubspot-embed-form, .hubspot-embed-form-v2')
    ) as Element[];

    const formsFromWrappers: HTMLFormElement[] = wrappers
      .map((w) => (w.querySelector('form.hsfc-Form, form.hs-form') as HTMLFormElement | null))
      .filter((f): f is HTMLFormElement => !!f);

    const all = [...direct, ...formsFromWrappers];
    // Deduplicate
    const unique = Array.from(new Set(all));
    return unique;
  };

  const queryUtmInput = (form: HTMLFormElement, key: UtmKey): HTMLInputElement | null => {
    const byNameContains = form.querySelector(`input[name*="${key}"]`) as HTMLInputElement | null;
    if (byNameContains) return byNameContains;
    const byNameEndsWith = form.querySelector(`input[name$="/${key}"]`) as HTMLInputElement | null;
    if (byNameEndsWith) return byNameEndsWith;
    const byIdContains = form.querySelector(`input[id*="${key}"]`) as HTMLInputElement | null;
    if (byIdContains) return byIdContains;
    return null;
  };

  const fillForm = (form: HTMLFormElement) => {
    if (!isHubspotForm(form)) return;
    if ((form as any).__utmInjected) return;
    (form as any).__utmInjected = true;

    const inputs = Array.from(
      form.querySelectorAll('input[type="hidden"], input[type="text"], input[type="email"]')
    ) as HTMLInputElement[];

    const applied: Record<string, { selector: string; value: string }> = {};

    UTM_KEYS.forEach((key) => {
      const input =
        inputs.find((i) => i.name && (i.name.includes(key) || i.name.endsWith('/' + key))) ||
        inputs.find((i) => i.id && i.id.includes(key)) ||
        queryUtmInput(form, key);

      const value = utm[key];
      if (input && typeof value === 'string' && value.length) {
        input.value = value;
        applied[key] = { selector: input.name || input.id || '(unknown)', value };
      }
    });

    if (Object.keys(applied).length) {
      log.group('Filled form', form);
      Object.entries(applied).forEach(([k, v]) => {
        console.log(`${k} -> ${v.selector}:`, v.value);
      });
      log.groupEnd();
    } else {
      log.group('No matching fields to fill', form);
      console.log('UTM available:', utm);
      log.groupEnd();
    }

    const ensureBeforeSubmit = () => {
      UTM_KEYS.forEach((key) => {
        const candidate = queryUtmInput(form, key);
        const value = utm[key];
        if (candidate && typeof value === 'string' && value.length) {
          candidate.value = value;
        }
      });

      // Debug: log what will be submitted (limited to UTM-related inputs)
      const payload: Record<string, string> = {};
      UTM_KEYS.forEach((key) => {
        const candidate = queryUtmInput(form, key);
        if (candidate && candidate.name) payload[candidate.name] = candidate.value;
      });
      log.group('Submit payload (UTM subset)', form);
      console.table(payload);
      log.groupEnd();
    };

    form.addEventListener('submit', ensureBeforeSubmit, { passive: true });
  };

  const bootAll = () => {
    const forms = findCandidateForms(document);
    if (!forms.length) {
      log.info('No HubSpot forms found at boot. Awaiting dynamic render...');
      return;
    }
    log.info(`Found ${forms.length} HubSpot form(s).`);
    forms.forEach(fillForm);
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type !== 'childList') continue;
      m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches && node.matches('form.hsfc-Form, form.hs-form')) {
          fillForm(node as HTMLFormElement);
          return;
        }
        if (node.matches && node.matches('.hubspot-embed-form, .hubspot-embed-form-v2')) {
          const nested = node.querySelector('form.hsfc-Form, form.hs-form') as HTMLFormElement | null;
          if (nested) fillForm(nested);
          return;
        }
        const nestedForms = node.querySelectorAll
          ? (node.querySelectorAll('form.hsfc-Form, form.hs-form') as NodeListOf<HTMLFormElement>)
          : ([] as unknown as NodeListOf<HTMLFormElement>);
        if (nestedForms && nestedForms.length) {
          nestedForms.forEach(fillForm);
        }
      });
    }
  });

  // Start
  bootAll();
  observer.observe(document.documentElement || document.body, { subtree: true, childList: true });

  log.info('Ready. Listening for HubSpot forms.');
};


