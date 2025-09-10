export const navbarMenuAttention = () => {
  const isDesktopViewport = () => window.innerWidth >= 768;

  const navbarRoot = document.querySelector('.navbar_component');
  const mainWrapper = document.querySelector('.main-wrapper');

  if (!navbarRoot || !mainWrapper) {
    return;
  }

  const FADE_MS = 200;
  const GRACE_MS = 150;

  let hideDelayTimeoutId: number | null = null;
  let removeTimeoutId: number | null = null;

  const hasAnyOpenDropdown = () =>
    !!navbarRoot.querySelector('.w-dropdown.w--open, .w-dropdown-toggle.w--open');

  const cancelAllTimers = () => {
    if (hideDelayTimeoutId !== null) {
      window.clearTimeout(hideDelayTimeoutId);
      hideDelayTimeoutId = null;
    }
    if (removeTimeoutId !== null) {
      window.clearTimeout(removeTimeoutId);
      removeTimeoutId = null;
    }
  };

  const applyBaseStyles = (element: HTMLElement) => {
    element.style.transition = `opacity ${FADE_MS}ms ease`;
    element.style.opacity = '0';
  };

  const fadeIn = (element: HTMLElement) => {
    // Force style application before transition
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  };

  const fadeOutAndRemove = (element: HTMLElement) => {
    element.style.opacity = '0';
    removeTimeoutId = window.setTimeout(() => {
      removeTimeoutId = null;
      // If another dropdown has opened during fade-out, keep the element
      if (hasAnyOpenDropdown() && isDesktopViewport()) {
        element.style.opacity = '1';
        return;
      }
      element.remove();
    }, FADE_MS);
  };

  const ensureAttentionElement = () => {
    const hasOpenDropdown = hasAnyOpenDropdown();

    const existing = document.querySelector('.menu-attention-element');

    if (!isDesktopViewport()) {
      cancelAllTimers();
      if (existing instanceof HTMLElement) fadeOutAndRemove(existing);
      return;
    }

    if (hasOpenDropdown && !existing) {
      const elem = document.createElement('div');
      elem.className = 'menu-attention-element';
      applyBaseStyles(elem as HTMLElement);
      mainWrapper.appendChild(elem);
      fadeIn(elem as HTMLElement);
    } else if (hasOpenDropdown && existing instanceof HTMLElement) {
      // Ensure visible and cancel any pending removal
      cancelAllTimers();
      existing.style.opacity = '1';
    } else if (!hasOpenDropdown && existing instanceof HTMLElement) {
      // Schedule graceful hide; cancel if another dropdown opens meanwhile
      if (hideDelayTimeoutId === null && removeTimeoutId === null) {
        hideDelayTimeoutId = window.setTimeout(() => {
          hideDelayTimeoutId = null;
          if (!hasAnyOpenDropdown() && isDesktopViewport()) {
            const elem = document.querySelector('.menu-attention-element') as HTMLElement | null;
            if (elem) fadeOutAndRemove(elem);
          }
        }, GRACE_MS);
      }
    }
  };

  const observer = new MutationObserver(() => {
    ensureAttentionElement();
  });

  observer.observe(navbarRoot, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  window.addEventListener('resize', ensureAttentionElement, { passive: true });

  ensureAttentionElement();
};


