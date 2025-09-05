export const hubspotFormPlaceholders_v2 = () => {
  // Function to process forms inside .hubspot-embed-form-v2
  const processForms = () => {
    const hubspotFormsV2 = document.querySelectorAll('.hubspot-embed-form-v2');

    if (hubspotFormsV2.length) {
      hubspotFormsV2.forEach((wrapper) => {
        // Labels in HubSpot v2 embed render as <label> with <span> containing text
        const labels = wrapper.querySelectorAll('label');

        labels.forEach((label) => {
          const labelText = label.textContent?.trim();
          const labelFor = label.getAttribute('for');

          if (labelText && labelFor) {
            const input = document.getElementById(labelFor) as HTMLInputElement | HTMLTextAreaElement | null;
            if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
              // Keep existing placeholder if present; otherwise set from label text
              if (!input.placeholder) {
                input.placeholder = labelText;
              }
            }
          }
        });

        // Make submit input look like site button (.button)
        const submitInputs = wrapper.querySelectorAll('input[type="submit"], button[type="submit"], .hs-button');
        submitInputs.forEach((btn) => {
          const element = btn as HTMLElement;
          element.className = '';
          element.classList.add('button');
        });
      });
    }
  };

  // Initial run
  processForms();
  // Try again after short delay for async render
  setTimeout(processForms, 1000);

  // Observe dynamic changes to ensure late renders are handled
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.querySelector && element.querySelector('.hubspot-embed-form-v2')) {
              setTimeout(processForms, 100);
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};


