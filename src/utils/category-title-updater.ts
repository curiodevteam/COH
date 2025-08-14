export const categoryTitleUpdater = () => {
  // Check if required elements exist on the page
  const categoryButtons = document.querySelectorAll('.button.is-category-filter.w-radio');
  const titleElement = document.querySelector('[category-title-based-on-filter]');
  
  if (!categoryButtons.length || !titleElement) {
    return;
  }

  // Function to update title based on active category
  const updateTitle = () => {
    const activeButton = document.querySelector('.button.is-category-filter.w-radio.is-list-active');
    
    if (activeButton) {
      const labelElement = activeButton.querySelector('.w-form-label');
      if (labelElement && labelElement.textContent) {
        titleElement.textContent = labelElement.textContent;
      }
    } else {
      // If no active button, clear the title
      titleElement.textContent = '';
    }
  };

  // Add click event listeners to all category buttons
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('is-list-active'));
      
      // Add active class to clicked button
      button.classList.add('is-list-active');
      
      // Update title
      updateTitle();
    });
  });

  // Initial title update
  updateTitle();
};
