export const hubspotFormPlaceholders = () => {
  // Function to process forms
  const processForms = () => {
    // Find all HubSpot embed forms
    const hubspotForms = document.querySelectorAll('.hubspot-embed-form');
    
    if (hubspotForms.length) {
      hubspotForms.forEach((form) => {
        // Find all field labels within this form
        const fieldLabels = form.querySelectorAll('.hsfc-FieldLabel');
        
        fieldLabels.forEach((label) => {
          // Get the text content from the label
          const labelText = label.textContent?.trim();
          
          if (labelText) {
            // Find the input by looking for the 'for' attribute in the label
            const labelFor = label.getAttribute('for');
            
            if (labelFor) {
              // Find the input element with the matching id
              const input = document.getElementById(labelFor) as HTMLInputElement | HTMLTextAreaElement;
              
              if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
                // Set the placeholder to the label text
                input.placeholder = labelText;
              }
            }
          }
        });
        
        // Find and process buttons within this form
        const buttons = form.querySelectorAll('button');
        
        buttons.forEach((button) => {
          // Remove all existing classes
          button.className = '';
          // Add the .button class
          button.classList.add('button');
        });
      });
    }
  };
  
  // Try to process forms immediately
  processForms();
  
  // Also try after a delay in case forms are loaded asynchronously
  setTimeout(processForms, 1000);
  
  // Use MutationObserver to watch for dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any added nodes contain HubSpot forms
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.querySelector && element.querySelector('.hubspot-embed-form')) {
              setTimeout(processForms, 100); // Small delay to ensure form is fully rendered
            }
          }
        });
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};
