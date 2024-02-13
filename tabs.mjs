/* ========== tab logic ========== */
function tabs(tabWrapper) {
  // Получаем все элементы содержимого вкладки (data-tab-content)
  const tabContent = document.querySelectorAll('*[data-tab-content]');

  // Отслеживание клика в обертке таба
  tabWrapper.addEventListener('click', (e) => {
    // Получаем заголовок таба
    const curItem = e.target.closest('*[data-tab-title]');
    // Переключаем классы content элеметы
    if (curItem) {
      toggletabClass(curItem);
    }
  });

  // Функция для переключения класса
  function toggletabClass(curItem) {
    curItem.classList.toggle('__opened');

    tabContent.forEach((block) => {
      // Сравнение значения content с title
      if (block.dataset.tabContent === curItem.dataset.tabTitle) {
        block.classList.toggle('__active');
      }
    });
  }
}

export default tabs;
