export const func_numberAnimations = () => {
  const all_numberSpans = document.querySelectorAll('[animated-number]');

  if (all_numberSpans.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const originalText = element.textContent || '0';

            // Store original number in data attribute if not already stored
            if (!element.dataset.originalNumber) {
              element.dataset.originalNumber = originalText;
            }

            // Determine number format (decimal separator)
            const hasComma = originalText.includes(',');
            const hasDot = originalText.includes('.');
            const decimalSeparator = hasComma ? ',' : hasDot ? '.' : '';

            // Extract numeric value
            const numericValue = parseFloat(originalText.replace(/[^\d.-]/g, ''));

            // Start animation after 300ms delay
            setTimeout(() => {
              animateNumber(element, 0, numericValue, decimalSeparator);
            }, 600);

            // Stop observing after animation starts
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
      }
    );

    // Start observing all elements
    all_numberSpans.forEach((element) => {
      observer.observe(element);
    });
  }
};

const animateNumber = (
  element: HTMLElement,
  start: number,
  end: number,
  decimalSeparator: string
) => {
  const duration = 1500; // Animation duration in milliseconds
  const startTime = performance.now();

  const updateNumber = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);

    const currentValue = start + (end - start) * easeOutQuart;

    // Format number with proper decimal separator
    const formattedNumber = decimalSeparator
      ? currentValue.toFixed(decimalSeparator === ',' ? 2 : 2).replace('.', decimalSeparator)
      : Math.round(currentValue).toString();

    element.textContent = formattedNumber;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      // Ensure final value is exactly the original
      element.textContent = element.dataset.originalNumber || '0';
    }
  };

  requestAnimationFrame(updateNumber);
};
