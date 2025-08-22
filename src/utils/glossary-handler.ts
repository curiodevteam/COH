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
    const offsetTop = elementTop - (offset * 16); // Convert rem to pixels (1rem = 16px)
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  };

  // Function to wait for Finsweet list to load
  const waitForFinsweetLoad = (): Promise<void> => {
    return new Promise((resolve) => {
      const checkLoaded = () => {
        const items = glossaryTermsList.querySelectorAll('[glossary_terms-list-item]');
        if (items.length > 0) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  };

  // Main initialization function
  const initGlossary = async () => {
    await waitForFinsweetLoad();
    
    const termsList = glossaryTermsList.querySelectorAll('[glossary_terms-list-item]');
    const lettersWrapper = document.querySelector('[glossary_letters-wrapper]');
    const termsNavigation = document.querySelector('[glossary_terms-navigation]');
    
    if (!lettersWrapper || !termsNavigation) {
      return;
    }

    // Extract terms and their first letters
    const terms: { title: string; element: Element; firstLetter: string }[] = [];
    
    termsList.forEach((item) => {
      const titleElement = item.querySelector('[glossary_terms-list-item-title]');
      if (titleElement) {
        const title = titleElement.textContent?.trim() || '';
        const firstLetter = title.charAt(0).toUpperCase();
        terms.push({ title, element: item, firstLetter });
      }
    });

    // Create alphabet navigation
    createAlphabetNavigation(lettersWrapper, terms);
    
    // Create terms navigation
    createTermsNavigation(termsNavigation, terms);
  };

  // Create alphabet navigation
  const createAlphabetNavigation = (wrapper: Element, terms: { title: string; element: Element; firstLetter: string }[]) => {
    // Clear all existing content
    wrapper.innerHTML = '';

    // Get unique letters from terms
    const uniqueLetters = [...new Set(terms.map(term => term.firstLetter))].sort();
    
    // Create alphabet (A-Z)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    alphabet.forEach(letter => {
      const letterParent = document.createElement('div');
      letterParent.setAttribute('glossary_letter-parent', '');
      letterParent.className = 'text-size-regular text-weight-medium';
      
      const letterLink = document.createElement('a');
      letterLink.setAttribute('glossary_letter-link', '');
      letterLink.href = '#';
      letterLink.className = 'glossary_letter';
      letterLink.textContent = letter;
      
      // Add disabled class if no terms start with this letter
      if (!uniqueLetters.includes(letter)) {
        letterLink.classList.add('is-disabled');
      } else {
        // Add click handler to scroll to first term with this letter
        letterLink.addEventListener('click', (e) => {
          e.preventDefault();
          const firstTermWithLetter = terms.find(term => term.firstLetter === letter);
          if (firstTermWithLetter) {
            scrollToElementWithOffset(firstTermWithLetter.element);
          }
        });
      }
      
      letterParent.appendChild(letterLink);
      wrapper.appendChild(letterParent);
    });
  };

  // Create terms navigation
  const createTermsNavigation = (navigation: Element, terms: { title: string; element: Element; firstLetter: string }[]) => {
    // Clear existing content
    navigation.innerHTML = '';
    
    // Group terms by first letter
    const termsByLetter = terms.reduce((acc, term) => {
      if (!acc[term.firstLetter]) {
        acc[term.firstLetter] = [];
      }
      acc[term.firstLetter].push(term);
      return acc;
    }, {} as Record<string, { title: string; element: Element; firstLetter: string }[]>);
    
    // Create navigation items for each letter
    Object.keys(termsByLetter).sort().forEach(letter => {
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
      
      // Sort terms alphabetically within each letter group
      const sortedTerms = termsByLetter[letter].sort((a, b) => a.title.localeCompare(b.title));
      
      // Create links for each term
      sortedTerms.forEach(term => {
        const termLink = document.createElement('a');
        termLink.setAttribute('glossary-nav-link', '');
        termLink.href = '#';
        termLink.className = 'text-size-medium text-weight-medium text-color-secondary is-glossary-nav-link';
        termLink.textContent = term.title;
        
        // Add click handler to scroll to term
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
  };

  // Initialize glossary
  initGlossary();
};
