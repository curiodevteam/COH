/**
 * Utility function to apply background colors to cards based on hex values
 * specified in the colored-grid-pattern attribute
 */
export const coloredGridPattern = () => {
  // Find all elements with colored-grid-pattern attribute
  const patternElements = document.querySelectorAll('[colored-grid-pattern]');

  patternElements.forEach((patternElement) => {
    // Get hex values from the attribute
    const hexValues = patternElement.getAttribute('colored-grid-pattern')?.split(',') || [];

    // Find all cards within this pattern element
    const cards = patternElement.querySelectorAll('[colored-card]');

    // Apply colors to cards
    cards.forEach((card, index) => {
      // Get color from hexValues array, cycling back to start if needed
      const colorIndex = index % hexValues.length;
      const backgroundColor = hexValues[colorIndex].trim();

      // Apply the background color
      (card as HTMLElement).style.backgroundColor = `#${backgroundColor}`;
    });
  });
};
