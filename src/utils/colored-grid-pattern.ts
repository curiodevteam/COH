/**
 * Utility function to apply background colors to cards based on hex values
 * specified in the colored-grid-pattern attribute
 */
export const coloredGridPattern = () => {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', coloredGridPattern);
    return;
  }

  // Function to apply colors to pattern elements
  const applyColorsToPattern = () => {
    // Find all elements with colored-grid-pattern attribute
    const patternElements = document.querySelectorAll('[colored-grid-pattern]');

    if (patternElements.length === 0) {
      return;
    }

    patternElements.forEach((patternElement) => {
      // Get hex values from the attribute
      const hexValues = patternElement.getAttribute('colored-grid-pattern')?.split(',') || [];

      // Find all cards within this pattern element
      const cards = patternElement.querySelectorAll('[colored-card]');

      // Apply colors to cards
      let visibleCardIndex = 0; // Separate counter for visible cards only

      cards.forEach((card) => {
        // Check if card is visible (not display: none)
        const cardElement = card as HTMLElement;
        const computedStyle = window.getComputedStyle(cardElement);

        if (computedStyle.display === 'none') {
          return; // Skip this card if it's hidden
        }

        // Get color from hexValues array, cycling back to start if needed
        const colorIndex = visibleCardIndex % hexValues.length;
        const backgroundColor = hexValues[colorIndex].trim();

        // Apply the background color
        cardElement.style.backgroundColor = `#${backgroundColor}`;

        // Increment visible card counter
        visibleCardIndex++;
      });
    });
  };

  // Apply colors initially
  applyColorsToPattern();

  // Set up MutationObserver to watch for new elements
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;

    mutations.forEach((mutation) => {
      // Check if new nodes were added
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Check if the added element or its children have the required attributes
            if (
              element.hasAttribute('colored-grid-pattern') ||
              element.hasAttribute('colored-card') ||
              element.querySelector('[colored-grid-pattern]') ||
              element.querySelector('[colored-card]')
            ) {
              shouldReapply = true;
            }
          }
        });
      }
      // Check if attributes were changed
      else if (mutation.type === 'attributes') {
        if (
          mutation.attributeName === 'colored-grid-pattern' ||
          mutation.attributeName === 'colored-card'
        ) {
          shouldReapply = true;
        }
      }
    });

    // Reapply colors if needed
    if (shouldReapply) {
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        applyColorsToPattern();
      }, 100);
    }
  });

  // Start observing the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['colored-grid-pattern', 'colored-card'],
  });

  // Cleanup function (optional, for when you need to disconnect the observer)
  return () => {
    observer.disconnect();
  };
};
