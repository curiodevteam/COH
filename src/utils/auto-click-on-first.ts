export const autoClickOnFirst = () => {
  // Find element with auto-click-on-first attribute
  const autoClickElement = document.querySelector('[auto-click-on-first]');

  if (autoClickElement) {
    // Get the attribute value from auto-click-on-first
    const targetAttribute = autoClickElement.getAttribute('auto-click-on-first');

    if (targetAttribute) {
      // Find first descendant with the target attribute (search in entire subtree)
      const targetChild = autoClickElement.querySelector(`[${targetAttribute}]`);

      if (targetChild) {
        // Try to find a clickable span next to the input
        const clickableSpan =
          targetChild.nextElementSibling?.querySelector('span[click-me-2]') ||
          targetChild.parentElement?.querySelector('span[click-me-2]') ||
          targetChild.closest('label')?.querySelector('span[click-me-2]');

        const elementToClick = clickableSpan || targetChild;

        // Click after 2 seconds
        setTimeout(() => {
          (elementToClick as HTMLElement).click();
        }, 500);
      }
    }
  }
};
