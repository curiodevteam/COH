export const func_popupOverlayHandler = () => {
  const popupParents = document.querySelectorAll('[cur-popup-parent]');

  if (popupParents.length === 0) return;

  popupParents.forEach((popupParent) => {
    const closeButton = popupParent.querySelector('[cur-popup-close-button]') as HTMLElement;

    if (!closeButton) return;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.zIndex = '1';

    // Insert overlay as first child
    popupParent.insertBefore(overlay, popupParent.firstChild);

    // Handle overlay click
    const handleOverlayClick = () => {
      closeButton.click();
    };

    // Handle ESC key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeButton.click();
      }
    };

    // Add event listeners
    overlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscKey);

    // Cleanup function
    const cleanup = () => {
      overlay.removeEventListener('click', handleOverlayClick);
      document.removeEventListener('keydown', handleEscKey);
    };

    // Store cleanup function for potential future use
    (popupParent as any)._popupOverlayCleanup = cleanup;
  });
};
