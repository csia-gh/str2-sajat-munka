const newTodoBtn = document.querySelector('#newTodoBtn');
const newTodoInput = document.querySelector('#newTodoInput');
const completedTasks = document.querySelector('.completed-tasks');
let completedTasksParagraph = document.querySelector('.completed-tasks p');
const pendingItems = document.querySelector('.pending-items');
let pendingItemsParagraph = document.querySelector('.pending-items p');
const day = document.querySelector('.day');
const date = document.querySelector('.date');
const hideCompleteBtn = document.querySelector('#hideComplete');
const clearAllBtn = document.querySelector('#clearAll');

const hideComplete = () => {
  completedTasks.classList.toggle('hide');
  hideCompleteBtn.textContent =
    hideCompleteBtn.textContent === 'Show Complete'
      ? 'Hide Complete'
      : 'Show Complete';
};

const renderTodos = () => {
  const todos = getTodos();
  todos.forEach((todo) => renderTodo(todo));
};

const getNameOfTheDay = (day) => {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][day];
};

const setDate = () => {
  const now = new Date();
  day.textContent = getNameOfTheDay(now.getDay());
  date.textContent = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
};

const setPendingItemsParagraph = () => {
  const todos = getTodos();
  let pendingCount = 0;
  todos.forEach((todo) => {
    if (!todo.completed) {
      pendingCount += 1;
    }
  });

  let textContent = '';
  if (pendingCount === 0) {
    textContent = `Time to chill! You have no todos.`;
    pendingItemsParagraph.classList.add('chill');
  } else if (pendingCount === 1) {
    textContent = `You have ${pendingCount} pending item.`;
    pendingItemsParagraph.classList.remove('chill');
  } else {
    textContent = `You have ${pendingCount} pending items.`;
    pendingItemsParagraph.classList.remove('chill');
  }
  pendingItemsParagraph.textContent = textContent;
};

setCompletedTasksParagraph = () => {
  const todos = getTodos();
  let completedCount = 0;
  todos.forEach((todo) => {
    if (todo.completed) {
      completedCount += 1;
    }
  });
  const percentage = (completedCount / todos.length) * 100;

  if (todos.length) {
    completedTasksParagraph.textContent = `Completed tasks: ${percentage.toFixed(
      0
    )}%`;
  }
};

const deleteTodoFromLocalStorage = (todoId) => {
  let todos = getTodos();
  const parsedTodoId = Number(todoId);
  todos = todos.filter((todo) => todo.id !== parsedTodoId);
  localStorage.setItem('todos', JSON.stringify(todos));
};

const deleteTodo = (event) => {
  const todoItemDiv = event.target.parentElement;
  const todoId = todoItemDiv.dataset.id;
  deleteTodoFromLocalStorage(todoId);
  todoItemDiv.remove();
  setParagraphs();
};

setTodoStatusInLocalStorage = (todoId, status) => {
  const todos = getTodos();
  const parsedTodoId = Number(todoId);
  const todo = todos.find((todo) => todo.id === parsedTodoId);
  if (todo) {
    todo.completed = status;
    localStorage.setItem('todos', JSON.stringify(todos));
    return todo;
  }
  return null;
};

todoStatusChanged = (event) => {
  const todoItemCheckbox = event.target;
  const isChecked = todoItemCheckbox.checked;
  const todoItemDiv = todoItemCheckbox.parentElement.parentElement;
  const todoId = todoItemDiv.dataset.id;

  const modifiedTodo = setTodoStatusInLocalStorage(todoId, isChecked);
  if (modifiedTodo) {
    todoItemDiv.remove();
    renderTodo(modifiedTodo);
    setParagraphs();
  }
};

const getNewTodoItem = (todo) => {
  const div = document.createElement('div');
  div.setAttribute('data-id', todo.id);
  div.classList.add('todo-item');
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.addEventListener('click', todoStatusChanged);
  if (todo.completed) input.checked = true;
  const span1 = document.createElement('span');
  span1.classList.add('todo');
  span1.textContent = todo.value;
  const span2 = document.createElement('span');
  span2.classList.add('show-trashcan');
  span2.addEventListener('click', (event) => event.preventDefault());
  const span3 = document.createElement('span');
  span3.classList.add('delete');
  span3.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  span3.addEventListener('click', deleteTodo);
  label.appendChild(input);
  label.appendChild(span1);
  label.appendChild(span2);
  div.appendChild(label);
  div.appendChild(span3);
  return div;
};

const renderTodo = (todo) => {
  const newTodoItem = getNewTodoItem(todo);
  if (todo.completed) {
    completedTasks.appendChild(newTodoItem);
  } else {
    pendingItems.appendChild(newTodoItem);
  }
};

const getTodos = () => {
  let todos = JSON.parse(localStorage.getItem('todos'));
  return todos ? todos : [];
};

const addNewTodoToLocalStorage = (item) => {
  const todos = getTodos();
  const newTodo = {
    id: Date.now(),
    value: item,
    completed: false,
  };
  todos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(todos));
  return newTodo;
};

const onAddNewTodo = () => {
  const newTodo = newTodoInput.value;
  if (newTodo) {
    newTodoObj = addNewTodoToLocalStorage(newTodo);
    newTodoInput.value = '';
    renderTodo(newTodoObj);
    setParagraphs();
  }
};

const setParagraphs = () => {
  setPendingItemsParagraph();
  setCompletedTasksParagraph();
};

const init = () => {
  setDate();
  setParagraphs();
  renderTodos();
};

const clearPendingItemsFromView = () => {
  pendingItems.innerHTML = '<p class="text"></p>';
  pendingItemsParagraph = document.querySelector('.pending-items p');
};
const clearcompletedTasksFromView = () => {
  completedTasks.innerHTML = '<p class="text"></p>';
  completedTasksParagraph = document.querySelector('.completed-tasks p');
};

const clearAll = () => {
  localStorage.removeItem('todos');
  clearPendingItemsFromView();
  clearcompletedTasksFromView();
  setParagraphs();
};

clearAllBtn.addEventListener('click', clearAll);
hideCompleteBtn.addEventListener('click', hideComplete);
newTodoBtn.addEventListener('click', onAddNewTodo);
newTodoInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter' || event.code === 'Enter') {
    onAddNewTodo();
  }
});

init();
