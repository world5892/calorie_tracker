// local storage controller
const StorageCtrl = (function () {
  return {
    getItemsfromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    storeItemInStorage: function (item) {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    editItemInStorage: function (id, name, calories) {
      const items = StorageCtrl.getItemsfromStorage();

      items.forEach(item => {
        if (item.id === parseInt(id)) {
          item.name = name;
          item.calories = calories;
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemInStorage: function (id) {
      const items = StorageCtrl.getItemsfromStorage();

      items.forEach(item => {
        if (item.id === parseInt(id)) {
          items.splice(items.indexOf(item), 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteAllFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();


// item controller
const ItemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    items: StorageCtrl.getItemsfromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function () {
      return data.items;
    },

    getNextId: function () {
      return ItemCtrl.getItems().length;
    },

    addItemToData: function (name, calories) {
      const id = ItemCtrl.getNextId();

      const newItem = new Item(id, name, calories);
      data.items.push(newItem);
    },

    updateCaloriesData: function () {
      let calories = 0;

      data.items.forEach(item => {
        calories += parseInt(item.calories);
      });

      console.log(calories);
      return calories;
    },

    editItemInData(id, name, calories) {
      const items = ItemCtrl.getItems();

      data.items.forEach(item => {
        if (item.id === parseInt(id)) {
          item.name = name;
          item.calories = calories;
        }
      });
    },

    deleteItemFromData: function (id) {
      //ItemCtrl.getItems().splice(id, 1);
      const items = ItemCtrl.getItems();

      items.forEach(item => {
        if (item.id === parseInt(id)) {
          data.items.splice(items.indexOf(item), 1);
        }
      });
    }
  }
})();



// ui controller
const UICtrl = (function () {
  const selectors = {
    itemList: '#item-list',
    items: '#item-list li',
    addMealInput: '#item-name',
    addCaloriesInput: '#item-calories',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    editBtn: '.fa-pencil',
    totalCalories: '.total-calories'
  };

  return {
    getSelectors: function () {
      return selectors;
    },

    addItemToList: function (id) {
      const name = document.querySelector(selectors.addMealInput).value;
      const calories = document.querySelector(selectors.addCaloriesInput).value;

      if (name !== '' && calories !== '') {
        const html = `
        <li class="collection-item" id="item-${id}">
        <strong>${name}: </strong> <em>${calories} Calories</em>
        <a href="#" class="secondary-content">
        <i class="fa fa-pencil"></i>
        </a>
      </li>
        `;

        document.querySelector(selectors.itemList).insertAdjacentHTML('beforeend', html);

        const newItem = { id, name, calories };

        document.querySelector(selectors.addMealInput).value = '';
        document.querySelector(selectors.addCaloriesInput).value = '';

        return newItem;
      }
    },

    showItemsFromStorage: function () {
      const items = StorageCtrl.getItemsfromStorage();

      items.forEach(item => {
        const html = `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="fa fa-pencil"></i>
            </a>
          </li>
        `;
        console.log(item);


        document.querySelector(selectors.itemList).insertAdjacentHTML('beforeend', html);
      });
    },

    updateCaloriesUi: function (calories = 0) {
      document.querySelector(selectors.totalCalories).textContent = calories;
    },

    showEditState: function () {
      document.querySelector(selectors.updateBtn).style.display = 'inline';
      document.querySelector(selectors.deleteBtn).style.display = 'inline';
    },

    hideEditState: function () {
      document.querySelector(selectors.updateBtn).style.display = 'none';
      document.querySelector(selectors.deleteBtn).style.display = 'none';
    },

    fillEditedInputs: function (id, items) {
      console.log(items);

      items.forEach(item => {
        if (item.id === parseInt(id)) {
          document.querySelector(selectors.addMealInput).value = item.name;
          document.querySelector(selectors.addCaloriesInput).value = item.calories;
        }
      });
    },

    editItemOnList: function (id, name, calories) {
      const editedItem = document.querySelector(`#item-${id}`);
      editedItem.children[0].textContent = `${name}:`;
      editedItem.children[1].textContent = `${calories} Calories`;

      document.querySelector(selectors.addMealInput).value = '';
      document.querySelector(selectors.addCaloriesInput).value = '';
    },

    editItemFromStorage(id) {
      const items = StorageCtrl.getItemsfromStorage();

      items.forEach(item => {
        if (item.id === parseInt(id)) {
          UICtrl.editItemOnList(item.id, item.name, item.calories);
        }
      });
    },

    deleteItemFromList: function (id) {
      document.querySelector(`#item-${id}`).remove();

      document.querySelector(selectors.addMealInput).value = '';
      document.querySelector(selectors.addCaloriesInput).value = '';
    },

    hideItemList: function (items) {
      if (!items) {
        document.querySelector(selectors.itemList).style.display = 'none';
      } else {
        document.querySelector(selectors.itemList).style.display = 'block';
      }
    }

  }
})();


// app controller
const App = (function (StorageCtrl, ItemCtrl, UICtrl) {
  const selectors = UICtrl.getSelectors();
  let editedItemId;

  const addItem = function () {
    const newItem = UICtrl.addItemToList(ItemCtrl.getNextId());

    if (newItem) {
      ItemCtrl.addItemToData(newItem.name, newItem.calories);
      StorageCtrl.storeItemInStorage(newItem);
      console.log(ItemCtrl.getItems());
    }
  };

  const getEditedItemId = function (e) {
    if (e.target.classList.contains('fa-pencil')) {

      editedItemId = e.target.parentNode.parentNode.id[e.target.parentNode.parentNode.id.length - 1];

      return editedItemId;
    }
  };

  const loadEventListeners = function () {
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
      }
    });

    document.querySelector(selectors.addBtn).addEventListener('click', (e) => {
      e.preventDefault();

      addItem();

      UICtrl.hideItemList(true);

      const calories = ItemCtrl.updateCaloriesData();
      UICtrl.updateCaloriesUi(calories);
    });

    document.querySelector(selectors.itemList).addEventListener('click', (e) => {
      e.preventDefault();

      UICtrl.showEditState();

      const id = getEditedItemId(e);

      UICtrl.fillEditedInputs(id, ItemCtrl.getItems());
    });

    document.querySelector(selectors.updateBtn).addEventListener('click', (e) => {
      e.preventDefault();

      const name = document.querySelector(selectors.addMealInput).value;
      const calories = document.querySelector(selectors.addCaloriesInput).value;

      ItemCtrl.editItemInData(editedItemId, name, calories);

      StorageCtrl.editItemInStorage(editedItemId, name, calories);

      UICtrl.editItemFromStorage(editedItemId);

      UICtrl.editItemOnList(editedItemId, name, calories);

      UICtrl.hideEditState();

      const totalCalories = ItemCtrl.updateCaloriesData();

      console.log(totalCalories);

      UICtrl.updateCaloriesUi(totalCalories);
    });

    document.querySelector(selectors.deleteBtn).addEventListener('click', (e) => {
      e.preventDefault();

      ItemCtrl.deleteItemFromData(editedItemId);

      StorageCtrl.deleteItemInStorage(editedItemId);

      UICtrl.deleteItemFromList(editedItemId);

      UICtrl.hideEditState();

      const totalCalories = ItemCtrl.updateCaloriesData();

      UICtrl.updateCaloriesUi(totalCalories);

      UICtrl.hideItemList(ItemCtrl.getItems().length);
    });

    document.querySelector(selectors.backBtn).addEventListener('click', (e) => {
      e.preventDefault();

      UICtrl.hideEditState();

      document.querySelector(selectors.addMealInput).value = '';
      document.querySelector(selectors.addCaloriesInput).value = '';
    });

    document.querySelector(selectors.clearBtn).addEventListener('click', (e) => {
      const items = document.querySelectorAll(selectors.items);

      if (items) {
        const itemsArr = Array.from(items);
        itemsArr.forEach(item => {
          item.remove();

          ItemCtrl.getItems().length = 0;

          UICtrl.updateCaloriesUi();

          UICtrl.hideItemList(null);
        });
      }

      StorageCtrl.deleteAllFromStorage();
    });

  }

  return {
    init: function () {
      UICtrl.showItemsFromStorage();

      loadEventListeners();

      const totalCalories = ItemCtrl.updateCaloriesData();
      UICtrl.updateCaloriesUi(totalCalories);

      UICtrl.hideEditState();

      UICtrl.hideItemList(StorageCtrl.getItemsfromStorage().length > 0);
    }
  }
})(StorageCtrl, ItemCtrl, UICtrl);

App.init();

