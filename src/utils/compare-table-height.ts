export const func_compareTableHeight = () => {
  const compareTables = document.querySelectorAll('.compare-table');
  
  if (compareTables.length === 0) return;

  const setEqualRowHeights = () => {
    // Process each compare table separately
    compareTables.forEach((compareTable) => {
      let columns: NodeListOf<Element>;
      
      // Check if this is a mobile table with tabs structure
      const isMobileTable = compareTable.classList.contains('is-mobile');
      
      if (isMobileTable) {
        // For mobile tables, find columns within active tab panes
        const activeTabPanes = compareTable.querySelectorAll('.w-tab-pane.w--tab-active');
        columns = activeTabPanes.length > 0 
          ? activeTabPanes[0].querySelectorAll('.compare-table_col')
          : compareTable.querySelectorAll('.compare-table_col');
      } else {
        // For PC tables, find columns directly
        columns = compareTable.querySelectorAll('.compare-table_col');
      }
      
      if (columns.length === 0) return;
      
      // Get all rows from all columns to find the maximum number of rows
      const allRows: HTMLElement[][] = [];
      columns.forEach((column) => {
        const rows = Array.from(column.querySelectorAll('.compare-table_col-row')) as HTMLElement[];
        allRows.push(rows);
      });
      
      // Find the maximum number of rows across all columns
      const maxRowsCount = Math.max(...allRows.map(rows => rows.length));
      
      // Process each row index
      for (let rowIndex = 0; rowIndex < maxRowsCount; rowIndex++) {
        let maxRowHeight = 0;
        
        // Reset heights to auto first to get natural heights
        allRows.forEach((rows) => {
          if (rows[rowIndex]) {
            rows[rowIndex].style.height = 'auto';
          }
        });
        
        // Find the tallest row at this index across all columns
        allRows.forEach((rows) => {
          if (rows[rowIndex]) {
            const height = rows[rowIndex].offsetHeight;
            if (height > maxRowHeight) {
              maxRowHeight = height;
            }
          }
        });
        
        // Apply the max height to all rows at this index
        allRows.forEach((rows) => {
          if (rows[rowIndex]) {
            rows[rowIndex].style.height = `${maxRowHeight}px`;
          }
        });
      }
    });
  };

  // Initial call
  setEqualRowHeights();
  
  // Add resize listener
  window.addEventListener('resize', setEqualRowHeights);
  
  // Add click listener for immediate and delayed recalculation
  document.addEventListener('click', () => {
    // Only process if compare tables exist on the page
    if (compareTables.length > 0) {
      // Immediate recalculation
      setEqualRowHeights();
      
      // Delayed recalculation after 100ms
      setTimeout(setEqualRowHeights, 100);
    }
  });
  
  // Add tab change listener for mobile tables
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    if (target && target.closest('.tab-link')) {
      // Wait for tab transition to complete
      setTimeout(setEqualRowHeights, 350); // Slightly longer than tab transition
    }
  });
};
