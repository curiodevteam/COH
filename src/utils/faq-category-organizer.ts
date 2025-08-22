export const faqCategoryOrganizer = () => {
  // Check if FAQ elements exist on the page
  const faqSources = document.querySelectorAll('[data-faq-category_src]');
  const faqWaiters = document.querySelectorAll('[data-faq-category_waiter]');
  
  if (!faqSources.length || !faqWaiters.length) {
    return;
  }

  // Create a map of category waiters
  const categoryWaiters = new Map<string, Element>();
  faqWaiters.forEach(waiter => {
    const category = waiter.getAttribute('data-faq-category_waiter');
    if (category) {
      categoryWaiters.set(category, waiter);
    }
  });

  // Move sources to their corresponding waiters
  faqSources.forEach(source => {
    const category = source.getAttribute('data-faq-category_src');
    const waiter = categoryWaiters.get(category);
    
    if (waiter) {
      waiter.appendChild(source);
    }
  });

  // Sort elements within each category by order
  categoryWaiters.forEach(waiter => {
    const children = Array.from(waiter.children);
    
    children.sort((a, b) => {
      const orderA = parseInt(a.getAttribute('data-faq-category_src-order') || '0');
      const orderB = parseInt(b.getAttribute('data-faq-category_src-order') || '0');
      return orderA - orderB;
    });

    // Re-append sorted children
    children.forEach(child => {
      waiter.appendChild(child);
    });
  });

  // Reload Webflow animations
  if (window.Webflow) {
    window.Webflow.destroy();
    window.Webflow.ready();
    window.Webflow.require('ix2').init();
  }
};
