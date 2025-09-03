// Type definitions for FinsweetAttributes
declare global {
  interface Window {
    FinsweetAttributes?: {
      list: {
        getList: (element: Element) => {
          isLoaded: boolean;
          loaded: Promise<void>;
        } | null;
      };
    };
  }
}

export const glossaryHandler = () => {
  // Check if glossary main layout exists
  const glossaryMain = document.querySelector('.layout.is-glossary-main');
  if (!glossaryMain) {
    return;
  }

  // Wait for Finsweet to load all items
  const glossaryTermsList = document.querySelector('[glossary_terms-list]');
  if (!glossaryTermsList) {
    return;
  }

  // Function to scroll to element with offset
  const scrollToElementWithOffset = (element: Element) => {
    const offset = 8.75; // 8.75rem offset from top
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top + window.pageYOffset;
    const offsetTop = elementTop - offset * 16; // Convert rem to pixels (1rem = 16px)

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  };

  // Build alphabet navigation
  function createAlphabetNavigation(
    wrapper: Element,
    terms: { title: string; element: Element; firstLetter: string }[]
  ) {
    wrapper.innerHTML = '';

    const uniqueLetters = [...new Set(terms.map((term) => term.firstLetter))].sort();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    alphabet.forEach((letter) => {
      const letterParent = document.createElement('div');
      letterParent.setAttribute('glossary_letter-parent', '');
      letterParent.className = 'text-size-regular text-weight-medium';

      const letterLink = document.createElement('a');
      letterLink.setAttribute('glossary_letter-link', '');
      letterLink.href = '#';
      letterLink.className = 'glossary_letter';
      letterLink.textContent = letter;

      if (!uniqueLetters.includes(letter)) {
        letterLink.classList.add('is-disabled');
      } else {
        letterLink.addEventListener('click', (e) => {
          e.preventDefault();
          const firstTermWithLetter = terms.find((term) => term.firstLetter === letter);
          if (firstTermWithLetter) {
            scrollToElementWithOffset(firstTermWithLetter.element);
          }
        });
      }

      letterParent.appendChild(letterLink);
      wrapper.appendChild(letterParent);
    });
  }

  // Build terms navigation
  function createTermsNavigation(
    navigation: Element,
    terms: { title: string; element: Element; firstLetter: string }[]
  ) {
    navigation.innerHTML = '';

    const termsByLetter = terms.reduce(
      (acc, term) => {
        if (!acc[term.firstLetter]) acc[term.firstLetter] = [];
        acc[term.firstLetter].push(term);
        return acc;
      },
      {} as Record<string, { title: string; element: Element; firstLetter: string }[]>
    );

    Object.keys(termsByLetter)
      .sort()
      .forEach((letter) => {
        const navigationItem = document.createElement('div');
        navigationItem.setAttribute('glossary_terms-navigation-item', '');
        navigationItem.className = 'glossary_terms-navigation-item';

        const letterHeading = document.createElement('p');
        letterHeading.setAttribute('glossary_terms-navigation-letter', '');
        letterHeading.className = 'heading-style-h3';
        letterHeading.textContent = letter;

        const termsList = document.createElement('div');
        termsList.setAttribute('glossary_terms-navigation-list', '');
        termsList.className = 'glossary_terms-navigation-list';

        const sortedTerms = termsByLetter[letter].sort((a, b) => a.title.localeCompare(b.title));

        sortedTerms.forEach((term) => {
          const termLink = document.createElement('a');
          termLink.setAttribute('glossary-nav-link', '');
          termLink.href = '#';
          termLink.className =
            'text-size-medium text-weight-medium text-color-secondary is-glossary-nav-link';
          termLink.textContent = term.title;

          termLink.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToElementWithOffset(term.element);
          });

          termsList.appendChild(termLink);
        });

        navigationItem.appendChild(letterHeading);
        navigationItem.appendChild(termsList);
        navigation.appendChild(navigationItem);
      });
  }

  // Function to wait for Finsweet list to load using FinsweetAttributes API
  const waitForFinsweetLoad = (): Promise<void> => {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts * 100ms = 3 seconds total
      let timeoutId: number;

      // Check if FinsweetAttributes is available
      if (typeof window.FinsweetAttributes === 'undefined') {
        // Fallback: wait for FinsweetAttributes to be available
        const checkFinsweetAvailable = () => {
          if (typeof window.FinsweetAttributes !== 'undefined') {
            waitForListLoad();
          } else {
            attempts += 1;
            if (attempts < maxAttempts) {
              timeoutId = setTimeout(checkFinsweetAvailable, 100);
            } else {
              // After 3 seconds, fallback to manual check
              console.error(
                'FinsweetAttributes not available after 3 seconds, using fallback method'
              );
              fallbackCheck();
            }
          }
        };
        checkFinsweetAvailable();
        return;
      }

      waitForListLoad();

      function waitForListLoad() {
        try {
          // Get the list instance for our glossary terms list
          if (glossaryTermsList && window.FinsweetAttributes) {
            const listInstance = window.FinsweetAttributes.list.getList(glossaryTermsList);

            if (listInstance) {
              // Check if list is already loaded
              if (listInstance.isLoaded) {
                // Additional delay to ensure all DOM updates are complete
                setTimeout(() => resolve(), 300);
                return;
              }

              // Wait for list to load
              listInstance.loaded
                .then(() => {
                  // Additional delay to ensure all DOM updates are complete
                  setTimeout(() => resolve(), 300);
                })
                .catch(() => {
                  // Fallback if list loading fails
                  console.error('FinsweetAttributes list loading failed, using fallback method');
                  fallbackCheck();
                });
            } else {
              // Fallback: check for elements manually
              fallbackCheck();
            }
          } else {
            // Fallback: check for elements manually
            fallbackCheck();
          }
        } catch (error) {
          console.error('FinsweetAttributes API error, using fallback method:', error);
          // Fallback method
          fallbackCheck();
        }
      }

      function fallbackCheck() {
        attempts += 1;
        if (glossaryTermsList) {
          const items = glossaryTermsList.querySelectorAll('[glossary_terms-list-item]');
          if (items.length > 0) {
            // Additional delay to ensure all items are fully rendered
            setTimeout(() => resolve(), 500);
          } else if (attempts < maxAttempts) {
            timeoutId = setTimeout(fallbackCheck, 100);
          } else {
            // After 3 seconds, resolve anyway to prevent infinite waiting
            console.error('Glossary items not found after 3 seconds, proceeding anyway');
            resolve();
          }
        } else if (attempts < maxAttempts) {
          timeoutId = setTimeout(fallbackCheck, 100);
        } else {
          // After 3 seconds, resolve anyway to prevent infinite waiting
          console.error('Glossary terms list not found after 3 seconds, proceeding anyway');
          resolve();
        }
      }

      // Cleanup function to clear timeout if needed
      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };

      // Set a hard timeout as final fallback
      setTimeout(() => {
        cleanup();
        console.error('Hard timeout reached, proceeding with glossary initialization');
        resolve();
      }, 3500); // 3.5 seconds total
    });
  };

  // Initialize glossary with repeated checks
  const initializeWithRetries = () => {
    let isBuilding = false;

    const buildOnce = async () => {
      if (isBuilding) return;
      isBuilding = true;
      try {
        await waitForFinsweetLoad();
        const termsList = glossaryTermsList.querySelectorAll('[glossary_terms-list-item]');
        const lettersWrapper = document.querySelector('[glossary_letters-wrapper]');
        const termsNavigation = document.querySelector('[glossary_terms-navigation]');
        if (!lettersWrapper || !termsNavigation) return;

        const terms: { title: string; element: Element; firstLetter: string }[] = [];
        termsList.forEach((item) => {
          const titleElement = item.querySelector('[glossary_terms-list-item-title]');
          if (titleElement) {
            const title = titleElement.textContent?.trim() || '';
            const firstLetter = title.charAt(0).toUpperCase();
            terms.push({ title, element: item, firstLetter });
          }
        });

        createAlphabetNavigation(lettersWrapper, terms);
        createTermsNavigation(termsNavigation, terms);
      } finally {
        isBuilding = false;
      }
    };

    // First immediate build
    buildOnce();

    // Re-run every 200ms for 3s total
    const intervalMs = 200;
    const totalMs = 10000;
    const start = Date.now();
    const intervalId = setInterval(() => {
      if (Date.now() - start >= totalMs) {
        clearInterval(intervalId);
        return;
      }
      buildOnce();
    }, intervalMs);
  };

  // Kick off
  initializeWithRetries();
};
