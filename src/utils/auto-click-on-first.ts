export const autoClickOnFirst = () => {
  console.log('🔍 autoClickOnFirst: Starting search...');

  // Find element with auto-click-on-first attribute
  const autoClickElement = document.querySelector('[auto-click-on-first]');
  console.log('🔍 autoClickOnFirst: Found element with auto-click-on-first:', autoClickElement);

  if (autoClickElement) {
    // Get the attribute value from auto-click-on-first
    const targetAttribute = autoClickElement.getAttribute('auto-click-on-first');
    console.log('🔍 autoClickOnFirst: Target attribute value:', targetAttribute);

    if (targetAttribute) {
      // Find first descendant with the target attribute (search in entire subtree)
      const targetChild = autoClickElement.querySelector(`[${targetAttribute}]`);
      console.log('🔍 autoClickOnFirst: Found target child:', targetChild);
      console.log('🔍 autoClickOnFirst: Target child HTML:', targetChild?.outerHTML);
      console.log(
        '🔍 autoClickOnFirst: All elements with this attribute:',
        autoClickElement.querySelectorAll(`[${targetAttribute}]`)
      );

      if (targetChild) {
        // Try to find a clickable span next to the input
        const clickableSpan =
          targetChild.nextElementSibling?.querySelector('span[click-me-2]') ||
          targetChild.parentElement?.querySelector('span[click-me-2]') ||
          targetChild.closest('label')?.querySelector('span[click-me-2]');

        const elementToClick = clickableSpan || targetChild;

        console.log('🔍 autoClickOnFirst: Element found, will click in 2 seconds:', elementToClick);

        // Click after 2 seconds
        setTimeout(() => {
          console.log('🔍 autoClickOnFirst: Executing click...');
          (elementToClick as HTMLElement).click();
          console.log('🔍 autoClickOnFirst: Click executed successfully');
        }, 500);
      } else {
        console.log('❌ autoClickOnFirst: No child found with attribute:', targetAttribute);
      }
    } else {
      console.log('❌ autoClickOnFirst: No target attribute value found');
    }
  } else {
    console.log('❌ autoClickOnFirst: No element found with auto-click-on-first attribute');
  }
};
