export const func_navbarTitlesSync = () => {
  // Find all elements with navbar_dropdown attribute
  const dropdownElements = document.querySelectorAll('[navbar_dropdown]');

  dropdownElements.forEach((dropdown) => {
    // Find first two elements with navbar-link-title-sync attribute within the dropdown
    const titleElements = dropdown.querySelectorAll('[navbar-link-title-sync]');

    if (titleElements.length >= 2) {
      // Get text content from first element
      const sourceText = titleElements[0].textContent;

      // Apply the text content to second element
      if (sourceText) {
        titleElements[1].textContent = sourceText;
      }
    }
  });
};
