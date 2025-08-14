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

  // Find all elements with colored-grid-pattern attribute
  const patternElements = document.querySelectorAll('[colored-grid-pattern]');

  if (patternElements.length === 0) {
    console.log('No elements with colored-grid-pattern attribute found');
    return;
  }

  patternElements.forEach((patternElement) => {
    // Get hex values from the attribute
    const hexValues = patternElement.getAttribute('colored-grid-pattern')?.split(',') || [];

    // Debug logging
    console.log('Pattern hex values:', hexValues);

    // Find all cards within this pattern element
    const cards = patternElement.querySelectorAll('[colored-card]');

    console.log(`Found ${cards.length} cards to color`);

    // Apply colors to cards
    let visibleCardIndex = 0; // Separate counter for visible cards only

    cards.forEach((card, index) => {
      // Check if card is visible (not display: none)
      const cardElement = card as HTMLElement;
      const computedStyle = window.getComputedStyle(cardElement);

      if (computedStyle.display === 'none') {
        console.log(`Card ${index + 1} is hidden, skipping`);
        return; // Skip this card if it's hidden
      }

      // Get color from hexValues array, cycling back to start if needed
      const colorIndex = visibleCardIndex % hexValues.length;
      const backgroundColor = hexValues[colorIndex].trim();

      // Debug logging
      console.log(
        `Card ${index + 1} (visible #${visibleCardIndex + 1}): Index ${colorIndex}, Color: #${backgroundColor}`
      );

      // Apply the background color
      cardElement.style.backgroundColor = `#${backgroundColor}`;

      // Increment visible card counter
      visibleCardIndex++;
    });
  });
};
