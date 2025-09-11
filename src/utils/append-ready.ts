export const moveAppendReadyElement = (): void => {
  const elementToMove = document.querySelector('[el_append-ready]') as HTMLElement | null;
  const targetParent = document.querySelector('[parent_append-ready]') as HTMLElement | null;

  if (!elementToMove || !targetParent) return;

  const firstElementChild = targetParent.firstElementChild;
  if (firstElementChild) {
    targetParent.insertBefore(elementToMove, firstElementChild);
  } else {
    targetParent.appendChild(elementToMove);
  }
};


