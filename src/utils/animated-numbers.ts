export const func_numberAnimations = () => {
  const all_numberSpans = document.querySelectorAll('[animated-number]');

  if (all_numberSpans.length) {
    // Reset all numbers to zero immediately
    all_numberSpans.forEach((element) => {
      const el = element as HTMLElement;
      const originalText = el.textContent || '0';

      // Store original number in data attribute
      el.dataset.originalNumber = originalText;

      // Determine number format
      const hasComma = originalText.includes(',');
      const hasDot = originalText.includes('.');
      const decimalSeparator = hasComma ? ',' : hasDot ? '.' : '';

      // Reset to zero with proper format
      el.textContent = decimalSeparator ? `0${decimalSeparator}00` : '0';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const originalText = element.dataset.originalNumber || '0';

            // Determine number format
            const hasComma = originalText.includes(',');
            const hasDot = originalText.includes('.');
            const decimalSeparator = hasComma ? ',' : hasDot ? '.' : '';

            // Extract numeric value
            const numericValue = parseFloat(originalText.replace(/[^\d.-]/g, ''));

            // Start animation after delay
            setTimeout(() => {
              animateNumber(element, 0, numericValue, decimalSeparator);
            }, 600);

            // Stop observing after animation starts
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
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
