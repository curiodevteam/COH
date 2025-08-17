export const loadSharerScript = () => {
  const sharerElements = document.querySelectorAll('[data-sharer]');

  if (sharerElements.length > 0) {
    // Check if script is already loaded
    if (!document.querySelector('script[src*="sharer.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sharer.js@0.5.2/sharer.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  // Set data-url attribute for sharing elements
  const allDataUrl = document.querySelectorAll('[data-url]');
  allDataUrl.forEach(dataEl => {
    dataEl.setAttribute('data-url', window.location.href);
  });

  // Add copy to clipboard functionality
  const copyTriggers = document.querySelectorAll('[copy-to-clipboard-trigger]');
  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const dataUrl = trigger.getAttribute('data-url');
      if (dataUrl) {
        navigator.clipboard.writeText(dataUrl).then(() => {
          // Optional: Add visual feedback here if needed
          console.log('URL copied to clipboard:', dataUrl);
        }).catch(err => {
          console.error('Failed to copy URL:', err);
        });
      }
    });
  });
};
