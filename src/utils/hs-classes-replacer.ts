export const func_rawHubspotStyles = () => {
  // Find all elements and filter those with hs-class-replacer attributes
  const allElements = document.querySelectorAll('*');
  const elements = Array.from(allElements).filter((element) => {
    return Array.from(element.attributes).some((attr) =>
      attr.name.startsWith('hs-class-replacer_')
    );
  });

  console.log('Found elements with hs-class-replacer:', elements);

  elements.forEach((element) => {
    // Get all attributes of the element
    const { attributes } = element;

    // Iterate through all attributes
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];

      // Check if attribute starts with hs-class-replacer_
      if (attr.name.startsWith('hs-class-replacer_')) {
        console.log('Found attribute:', attr.name, 'with value:', attr.value);
        const { value } = attr;

        // Split the value by '/' to get original class and new classes
        const [originalClass, newClasses] = value.split('/');

        if (originalClass && newClasses) {
          // Find the element with original class
          const targetElement = element.querySelector(`.${originalClass}`);

          if (targetElement) {
            console.log('Found target element:', targetElement);
            // Remove all existing classes
            targetElement.className = '';

            // Add new classes
            targetElement.className = newClasses;
            console.log('Updated classes to:', newClasses);
          }
        }
      }
    }
  });
};

// Function to initialize the replacer
export const initHubspotStylesReplacer = () => {
  // Run after 2 seconds when all scripts are loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      func_rawHubspotStyles();
    }, 2000);
  });

  // Run every 5 seconds after initial delay
  setInterval(func_rawHubspotStyles, 5000);
};
