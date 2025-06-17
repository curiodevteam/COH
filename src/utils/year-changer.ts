export const func_yearChanger = () => {
  const all_yearSpan = document.querySelectorAll('[current-year]');
  if (all_yearSpan.length) {
    const currentYear = new Date().getFullYear();
    all_yearSpan.forEach((element) => {
      element.textContent = currentYear.toString();
    });
  }
};
