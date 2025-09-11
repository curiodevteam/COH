export const categoryTitleUpdater = () => {
  // Check if required elements exist on the page
  const categoryButtons = document.querySelectorAll('.button.is-category-filter.w-radio');
  const titleElement = document.querySelector('[category-title-based-on-filter]');

  if (!categoryButtons.length || !titleElement) {
    return;
  }

  // Function to update title based on clicked button or checked input
  const updateTitle = (sourceButton?: Element | null) => {
    const resolveLabelText = (buttonEl: Element | null): string | null => {
      if (!buttonEl) return null;
      const labelElement = buttonEl.querySelector('.w-form-label') as HTMLElement | null;
      return labelElement && labelElement.textContent ? labelElement.textContent.trim() : null;
    };

    let titleText: string | null = null;

    // 1) Prefer the label from the clicked button (immediate feedback)
    if (sourceButton) {
      titleText = resolveLabelText(sourceButton);
    }

    // 2) Fallback to the currently checked radio input (true state)
    if (!titleText) {
      const checkedInput = document.querySelector(
        '.button.is-category-filter.w-radio input[type="radio"][fs-list-field="category"]:checked'
      ) as HTMLInputElement | null;
      if (checkedInput) {
        const checkedLabel = checkedInput.closest('.button.is-category-filter.w-radio');
        titleText = resolveLabelText(checkedLabel);
      }
    }

    // 3) Fallback to any element marked as active (if present in markup)
    if (!titleText) {
      const activeButton = document.querySelector(
        '.button.is-category-filter.w-radio.is-list-active'
      );
      titleText = resolveLabelText(activeButton);
    }

    if (titleText !== null) {
      (titleElement as HTMLElement).textContent = titleText;
    }
  };

  // Add click event listeners to all category buttons
  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      // categoryButtons.forEach((btn) => btn.classList.remove('is-list-active'));

      // Add active class to clicked button
      // button.classList.add('is-list-active');

      // Update title immediately based on clicked button
      updateTitle(button);
    });
  });

  // Initial title update
  updateTitle();
};
