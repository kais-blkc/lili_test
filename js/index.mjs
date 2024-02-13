import tabs from './tabs.mjs';

let treeHashmap = {};

// Получить шаблон элеменда дерева
const getTreeMenuItemStr = (item, classes = '') => {
  const dataTabContent = item.head ? `data-tab-content="${item.head}"` : '';

  return `
  <div class="tree-menu__item ${classes}" ${dataTabContent}>
    <div class="hidden-info" data-tab-content="hidden-info">id: ${item.id} | sorthead: ${item.sorthead} | head: ${item.head}</div>
    <div class="tree-menu__item-title">${item.name} (${item.price})</div>
  </div>
`;
};

// Получение данных с API
async function getFetchData() {
  const response = await fetch('/data.json');
  const data = await response.json();
  return data;
}

// Создание хэш таблицы дерева
function createTreeHashMap(arrData) {
  // Сортировка данных по sorthead
  const sortedByHeadList = arrData.sort((a, b) => a.sorthead - b.sorthead);
  const result = {};

  sortedByHeadList.forEach((el) => {
    // Если ключ есть дополнить
    if (el.head in result) {
      result[el.head].push(el);
      // Если ключа нет то создать
    } else {
      result[el.head] = [el];
    }
  });

  return result;
}

// Добавление данных в HTML
function appendTreeInHMTL(treeList, nodeParent) {
  // treeList - Элементы дерева
  // nodeParent - Node родительский элемент куда добавлять элементы

  treeList.forEach((item) => {
    const curClasses = item.head ? 'tree-menu__subitem' : '';

    nodeParent.insertAdjacentHTML(
      'beforeend',
      getTreeMenuItemStr(item, curClasses)
    );

    // Если у элемента есть дети
    if (item.node) {
      // Получем текущий элемент из DOM, и его заголовок
      const lastChild = nodeParent.lastElementChild;
      const lastChildTitle = lastChild.querySelector('.tree-menu__item-title');

      lastChild.classList.add('__has-child');
      // Добавить data-tag-title заголовку элемента
      lastChildTitle.dataset.tabTitle = item.id;
      // Вызов рекурсии для дочерних элементов / Сделать все тоже самое для дочерних элементов
      appendTreeInHMTL(treeHashmap[item.id], lastChild);
    }
  });
}

// Обработчик ошибок
function errorHandler(err) {
  console.log('Error handler');
  throw err;
}

/* ===== Начало работы ===== */
// Получание данных с API
getFetchData()
  .then((data) => {
    // Обработка данных и вставка в глобальную переменную treeHashmap
    treeHashmap = createTreeHashMap(data.services);
  })
  .then((data) => {
    const threeMenuList = document.querySelector('#tree-menu__list');
    // Вставка данных в HTML
    appendTreeInHMTL(treeHashmap['null'], threeMenuList);
    // Инициализация tabs
    tabs(document.body);
  })
  .catch(errorHandler);
