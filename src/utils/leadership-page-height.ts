export const func_leadershipPageHeight = () => {
  const collectionLists = document.querySelectorAll('[cl_leadership-page]');
  
  if (collectionLists.length === 0) return;

  const setEqualHeight = () => {
    const windowWidth = window.innerWidth;
    
    // Only apply on screens 768px and wider
    if (windowWidth >= 768) {
      // Process each collection list separately
      collectionLists.forEach((collectionList, listIndex) => {
        const items = collectionList.querySelectorAll('[cl-i_leadership-page]');
        
        if (items.length === 0) return;
        
        let maxHeight = 0;
        
        // Reset heights to auto first to get natural heights
        items.forEach((item) => {
          (item as HTMLElement).style.height = 'auto';
          (item as HTMLElement).style.minHeight = 'auto';
          (item as HTMLElement).style.maxHeight = 'none';
        });
        
        // Find the tallest element in this collection list
        items.forEach((item) => {
          const height = (item as HTMLElement).offsetHeight;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });
        
        // Apply the max height to all items in this collection list
        items.forEach((item) => {
          (item as HTMLElement).style.height = `${maxHeight}px`;
          (item as HTMLElement).style.minHeight = `${maxHeight}px`;
          (item as HTMLElement).style.maxHeight = `${maxHeight}px`;
        });
      });
    } else {
      // Reset to auto height on smaller screens
      collectionLists.forEach((collectionList, listIndex) => {
        const items = collectionList.querySelectorAll('[cl-i_leadership-page]');
        items.forEach((item) => {
          (item as HTMLElement).style.height = 'auto';
          (item as HTMLElement).style.minHeight = 'auto';
          (item as HTMLElement).style.maxHeight = 'none';
        });
      });
    }
  };

  // Initial call
  setEqualHeight();
  
  // Add resize listener
  window.addEventListener('resize', setEqualHeight);
};
