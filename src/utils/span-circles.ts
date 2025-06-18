import rough from 'roughjs'; // Оставляем импорт для совместимости, но не используем

export const func_spanCircles = () => {
  // Create and append styles
  const style = document.createElement('style');
  style.textContent = `
    .highlight {
      position: relative;
      display: inline-block;
    }
    .highlight > svg {
      position: absolute;
      top: 0px;
      z-index: -1;
      pointer-events: none;
      overflow: visible;
    }
    .text {
      position: relative;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);

  // Process text nodes
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: () => NodeFilter.FILTER_ACCEPT,
  });
  const nodesToProcess = [];

  // Collect nodes for processing
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue?.includes('**')) {
      nodesToProcess.push(node);
    }
  }

  // Process nodes in reverse order to avoid DOM issues
  nodesToProcess.reverse().forEach((node) => {
    const text = node.nodeValue || '';
    const parent = node.parentNode;
    if (!parent) return;

    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let result = '';

    // Split text into parts
    let match;
    while ((match = regex.exec(text))) {
      result += text.slice(lastIndex, match.index);
      const innerText = match[1].trim().replace(/\s+/g, ' ');
      result += `<span class="highlight"><svg></svg><span class="text">${innerText}</span></span>`;
      lastIndex = match.index + match[0].length;
    }
    result += text.slice(lastIndex);

    // Insert processed HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result;
    while (tempDiv.firstChild) {
      parent.insertBefore(tempDiv.firstChild, node);
    }
    parent.removeChild(node);
  });

  // Function to update ellipses using standard SVG
  function updateEllipses() {
    document.querySelectorAll('.highlight').forEach((highlight) => {
      const svg = highlight.querySelector('svg');
      if (svg) {
        const { width, height } = highlight.getBoundingClientRect();
        const em = parseFloat(getComputedStyle(highlight).fontSize) || 16;
        const extra = 0.01 * width; // 5% of the width on each side
        const extension = 0.2 * em + extra;
        const svgWidth = width + 2 * extension;
        const svgHeight = height + 4; // small height margin
        svg.style.left = -extension + 'px';
        svg.style.width = svgWidth + 'px';
        svg.style.height = svgHeight + 'px';
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.innerHTML = '';

        // Create a standard SVG path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const baseW = 509,
          baseH = 63;
        const scaleX = svgWidth / baseW;
        const scaleY = svgHeight / baseH;
        const pathData = `M276.944 60.9893C269.559 60.9979 262.074 61 254.5 61C112.873 61 2 60.2684 2 30.0629C2 -0.142578 112.873 2.03456 254.5 2.03456C396.127 2.03456 507 -0.142578 507 30.0629C507 55.9993 425.253 60.2044 312.481 60.875C307.552 60.9043 302.563 60.9269 297.519 60.9442M276.944 60.9893C283.895 60.9813 290.756 60.9674 297.519 60.9442M276.944 60.9893L297.519 60.9442`;
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', '#EA1D63');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('transform', `scale(${scaleX},${scaleY})`);
        svg.appendChild(path);
      }
    });
  }

  // Initial call
  requestAnimationFrame(updateEllipses);

  // Handle resize
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateEllipses);
  });
};
