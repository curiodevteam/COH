export const loadFinsweetAttributes = () => {
  // Check if script is already loaded
  const existingScript = document.querySelector('script[src*="finsweet/attributes"]');
  if (existingScript) {
    return;
  }

  // Create script element
  const script = document.createElement('script');
  script.async = true;
  script.type = 'module';
  script.src = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js';
  script.setAttribute('fs-attributes-auto', '');

  // Add script to document head
  document.head.appendChild(script);
};
