export const func_spanCircles = () => {
  // Create and append styles
  const style = document.createElement('style');
  style.textContent = `
    .highlight {
      position: relative;
      display: inline-block;
      padding: 1px; /* half of stroke-width */
    }
    .text {
      position: relative;
      z-index: 1;
      padding: 0 10px; /* adjust as needed */
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
      const innerText = match[1].trim().replace(/\s+/g, ' ');
      result += `<span class="highlight"><svg style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;"><rect style="fill:none;stroke:red;stroke-width:2;" /></svg><span class="text">${innerText}</span></span>`;
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

  // Функция для обновления размеров SVG rect
  function updateRects() {
    document.querySelectorAll('.highlight').forEach((highlight) => {
      const svg = highlight.querySelector('svg');
      const rect = svg && svg.querySelector('rect');
      if (svg && rect) {
        const { width, height } = highlight.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        rect.setAttribute('width', width.toString());
        rect.setAttribute('height', height.toString());
        const r = (height / 2).toString();
        rect.setAttribute('rx', r);
        rect.setAttribute('ry', r);
      }
    });
  }

  // Первоначальный вызов
  requestAnimationFrame(updateRects);

  // Обработка resize
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateRects);
  });
};
