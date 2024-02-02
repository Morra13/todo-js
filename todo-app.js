(function (){
  function createAppTitle (title) {
    let appTitle = document.createElement('h2')
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm () {
    let form = document.createElement('form')
    let input = document.createElement('input')
    let buttonWrapper = document.createElement('div')
    let button = document.createElement('button')

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary', 'disabled');
    button.disabled = true;
    button.textContent = 'Добавить дело';

    input.addEventListener('input', (evt) => {
      if (input.value) {
        button.disabled = false;
        button.classList.remove('disabled')
      } else {
        button.disabled = true;
        button.classList.add('disabled')
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    }
  }

  function createTodoList () {
    let list = document.createElement('ul');
    list.classList.add('list-group');

    return list;
  }

  function createTodoApp(container, title, listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let getDataFromLocalStorage = localStorage.getItem(listName);
    let todoItems = getDataFromLocalStorage ? JSON.parse(getDataFromLocalStorage) : [];
    let todoId = todoItems.length > 0 ? todoItems[todoItems.length - 1]['id'] + 1 : 1;
    if (todoItems.length > 0) {
      todoItems.forEach(function (data) {
        let todoItemFromLocalStage = createTodoItem(data['id'], data['value'], data['done']);
        if (data['done']) {
          todoItemFromLocalStage.item.classList.add('list-group-item-success');
        }
        todoList.append(todoItemFromLocalStage.item);
        todoItemStatusChangeAndDelete(todoItemFromLocalStage, todoItems, listName)
      })
    }

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();
      let value = todoItemForm.input.value;
      let todoItem;

      if (todoItems.length == 0) {
        todoItem = createTodoItem(todoId, value , false);
        todoItems = [{'id': todoId, 'value': value, 'done': false}];
        setTodoData(listName, todoItems)
      } else {
        let id = todoItems[todoItems.length - 1]['id'] + 1;
        todoItem = createTodoItem(id, value, false);
        todoItems.push({'id': id, 'value': value, 'done': false});
        setTodoData(listName, todoItems)
      }

      todoItemStatusChangeAndDelete(todoItem, todoItems, listName)
      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
      todoItemForm.button.classList.add('disabled')
    })
  }

  function todoItemStatusChangeAndDelete (todoItem, data, listName) {
    todoItem.doneButton.addEventListener('click', function () {
      data.forEach(function (storage, key) {
        if (storage['id'] == todoItem.item.id) {
          data[key]['done'] = data[key]['done'] ? false : true;
        }
        setTodoData(listName, data)
      })
      todoItem.item.classList.toggle('list-group-item-success');
    })

    todoItem.deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены')) {
        data.forEach(function (storage, key) {
          if (storage['id'] == todoItem.item.id) {
            data.splice(key, 1);
            setTodoData(listName, data)
          }
        })
        todoItem.item.remove()
      }
    })
  }

  function dataToJson (data) {
    return JSON.stringify(data);
  }
  function setTodoData (listName, data) {
    localStorage.setItem(listName, dataToJson(data));
  }

  function createTodoItem (id, name, done = false) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    item.id = id;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  window.createTodoApp = createTodoApp;
})();
