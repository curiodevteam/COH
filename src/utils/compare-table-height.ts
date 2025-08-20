export const func_compareTableHeight = () => {
  const compareTables = document.querySelectorAll('.compare-table');
  
  if (compareTables.length === 0) return;

  const setEqualRowHeights = () => {
    const windowWidth = window.innerWidth;
    
    // Only apply on screens 768px and wider
    if (windowWidth >= 768) {
      // Process each compare table separately
      compareTables.forEach((compareTable) => {
        const columns = compareTable.querySelectorAll('.compare-table_col');
        
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
              rows[rowIndex].style.minHeight = 'auto';
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
              rows[rowIndex].style.minHeight = `${maxRowHeight}px`;
            }
          });
        }
      });
    } else {
      // Reset to auto height on smaller screens
      compareTables.forEach((compareTable) => {
        const rows = compareTable.querySelectorAll('.compare-table_col-row');
        rows.forEach((row) => {
          (row as HTMLElement).style.minHeight = 'auto';
        });
      });
    }
  };

  // Initial call
  setEqualRowHeights();
  
  // Add resize listener
  window.addEventListener('resize', setEqualRowHeights);
};
