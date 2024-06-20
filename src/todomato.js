/** @format */

import { ControllerTimer } from './controllers/Timer.js';
import { ControllerTodo } from './controllers/Todo.js';

const todoForm = document.getElementById('todo-form');
const todoNameInput = document.getElementById('todo-name');
const todoDescriptionInput = document.getElementById('todo-description');
const todoList = document.getElementById('todo-list');
//const completedList = document.getElementById('completed-list');
const logoutButton = document.getElementById('btnLogOut');

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('userLogged');
  setTimeout(() => {
    window.location.href = './pages/home/index.html';
  }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
  let currentUser = localStorage.getItem('userLogged');
  const container = document.getElementById('containerId');

  if (!!currentUser) {
    let objectUser = JSON.parse(currentUser);
    let loggedUserName = objectUser.username;
    const loggedUserNamep = document.createElement('p');
    loggedUserNamep.classList.add('loggedUserText');

    loggedUserNamep.innerHTML = 'Cosa facciamo oggi <b>' + loggedUserName + '</b>?';
    container.appendChild(loggedUserNamep);
  }
});

const controllerTodo = new ControllerTodo();
const controllerTimer = new ControllerTimer();

document.addEventListener('DOMContentLoaded', () => {
  const completedList = document.getElementById('completed-list');
  completedList.innerHTML = '';

  let currentTodos = localStorage.getItem('todosCompleted');
  let currentUser = localStorage.getItem('userLogged');

  if (currentUser && currentTodos) {
    let objectUser = JSON.parse(currentUser);
    let todosCompleted = JSON.parse(currentTodos);

    let userId = objectUser.id;

    console.log('User ID:', userId);

    let userTodosCompleted = todosCompleted.filter(todo => todo.userId === userId);

    console.log("Todos completati per l'utente:", userTodosCompleted);

    const controllerTodo = new ControllerTodo();
    controllerTodo.loadTodoCompleted(userTodosCompleted);

    console.log('Caricamento todos completati riuscito!');
  }
});

todoForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const nomeAttivita = todoNameInput.value;
  const description = todoDescriptionInput.value;
  let currentUser = JSON.parse(localStorage.getItem('userLogged'));
  let userId = currentUser.id;

  const todo = controllerTodo.addTodo(nomeAttivita, description, userId);
  addTodoToDOM(todo);

  console.log(todo);
  console.log('Todo utente Salvato');

  todoNameInput.value = '';
  todoDescriptionInput.value = '';
});

function addTodoToDOM(todo) {
  const li = document.createElement('li');
  li.setAttribute('data-id', todo.todoId);

  const nameSpan = document.createElement('span');
  nameSpan.className = 'todo-name';
  nameSpan.textContent = todo.nomeAttivita;

  const descriptionSpan = document.createElement('span');
  descriptionSpan.className = 'todo-description';
  descriptionSpan.textContent = `: ${todo.description}`;

  const timerSpan = document.createElement('span');
  timerSpan.className = 'timer';
  timerSpan.textContent = '(--:--)';

  const timerControls = document.createElement('div');
  timerControls.className = 'timer-controls';

  const resumeButton = document.createElement('button');
  const pauseButton = document.createElement('button');
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');
  const completeButton = document.createElement('button');
  const createTimerButton = document.createElement('button');

  resumeButton.style.display = 'none';
  const resumeImg = document.createElement('img');
  resumeImg.src = './assets/img/clock-02.svg';
  resumeImg.width = 20;
  resumeImg.height = 20;
  resumeImg.alt = 'Resume';
  resumeButton.appendChild(resumeImg);
  resumeButton.addEventListener('click', function () {
    resumeButton.style.display = 'none';
    pauseButton.style.display = 'block';
    if (todo.timer) {
      controllerTimer.resume(todo.timer);
    }
  });

  pauseButton.style.display = 'none';
  const pauseImg = document.createElement('img');
  pauseImg.src = './assets/img/pause-02.svg';
  pauseImg.width = 20;
  pauseImg.height = 20;
  pauseImg.alt = 'Pause';
  pauseButton.appendChild(pauseImg);
  pauseButton.addEventListener('click', function () {
    resumeButton.style.display = 'block';
    pauseButton.style.display = 'none';
    if (todo.timer) {
      controllerTimer.pause(todo.timer);
    }
  });

  editButton.style.display = 'none';
  const editImg = document.createElement('img');
  editImg.src = './assets/img/editButton-02.svg';
  editImg.width = 20;
  editImg.height = 20;
  editImg.alt = 'Edit';
  editButton.appendChild(editImg);
  editButton.addEventListener('click', function () {
    controllerTimer.pause(todo.timer);
    const newName = prompt('Inserisci un nuovo nome attività:', todo.nomeAttivita);
    const newDescription = prompt('Inserisci una nuova descrizione:', todo.description);

    if (newName !== null) {
      controllerTodo.updateTodoName(todo.todoId, newName);
      nameSpan.textContent = newName;
    }

    if (newDescription !== null) {
      controllerTodo.updateTodoDescription(todo.todoId, newDescription);
      descriptionSpan.textContent = `: ${newDescription}`;
    }
    controllerTimer.resume(todo.timer);
  });

  deleteButton.style.display = 'none';
  const deleteImg = document.createElement('img');
  deleteImg.src = './assets/img/eraseButton-03.svg';
  deleteImg.width = 20;
  deleteImg.height = 20;
  deleteImg.alt = 'Delete';
  deleteButton.appendChild(deleteImg);
  deleteButton.addEventListener('click', function () {
    controllerTodo.deleteTodo(todo.todoId);
    li.remove();
  });

  completeButton.style.display = 'none';
  const completeImg = document.createElement('img');
  completeImg.src = './assets/img/checkCompleted-02.svg';
  completeImg.width = 20;
  completeImg.height = 20;
  completeImg.alt = 'Complete';
  completeButton.appendChild(completeImg);
  completeButton.addEventListener('click', function () {
    controllerTodo.moveTodoToCompleted(todo);
    li.remove();
  });

  const playImg = document.createElement('img');
  playImg.src = './assets/img/play-02.svg';
  playImg.width = 20;
  playImg.height = 20;
  playImg.alt = 'Create Timer';
  createTimerButton.appendChild(playImg);
  createTimerButton.addEventListener('click', function () {
    pauseButton.style.display = 'block';
    deleteButton.style.display = 'block';
    editButton.style.display = 'block';
    completeButton.style.display = 'block';

    createTimerButton.style.display = 'none';
    if (!todo.timer) {
      const timer = controllerTimer.create(25, true);
      todo.timer = timer;
    }
  });

  timerControls.appendChild(createTimerButton);
  timerControls.appendChild(pauseButton);
  timerControls.appendChild(resumeButton);
  timerControls.appendChild(deleteButton);
  timerControls.appendChild(editButton);
  timerControls.appendChild(completeButton);

  li.appendChild(nameSpan);
  li.appendChild(descriptionSpan);
  li.appendChild(timerSpan);
  li.appendChild(timerControls);
  todoList.appendChild(li);

  // Update del timer ogni secondo
  const intervalId = setInterval(() => {
    if (todo.timer && !todo.timer.isPaused) {
      const remainingTime = controllerTimer.read(todo.timer);
      if (remainingTime.minutes > 0 || remainingTime.seconds > 0) {
        if (remainingTime.seconds < 10) {
          timerSpan.textContent = ` (${remainingTime.minutes} : 0${remainingTime.seconds})`;
        } else {
          timerSpan.textContent = ` (${remainingTime.minutes} : ${remainingTime.seconds})`;
        }
      } else {
        if (todo.timer.isPomodoro) {
          todo.timer = controllerTimer.nextPomodoroSession(todo.timer);
          const newTimeRemaining = controllerTimer.read(todo.timer);
          timerSpan.textContent = ` (${newTimeRemaining.minutes} : ${newTimeRemaining.seconds})`;
        } else {
          timerSpan.textContent = " (Time's up!)";
          controllerTodo.moveTodoToCompleted(todo);
          clearInterval(intervalId);
        }
      }
    }
  }, 1000);
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  // Memorizza gli ID dei todos già aggiunti
  const addedTodoIds = new Set();

  // Ottieni l'elemento genitore dove aggiungere i todos
  const todoList = document.getElementById('todo-list');

  // Per ogni todo nel localStorage
  todos.forEach(todo => {
    // Verifica se questo todo è già stato aggiunto
    if (!addedTodoIds.has(todo.id)) {
      // Aggiungi il todo al DOM
      addTodoToDOM(todo);
      // Aggiungi l'ID del todo all'insieme di quelli già aggiunti
      addedTodoIds.add(todo.id);
    }
  });
}

window.onload = loadTodos;

// function loadTodos() {
//   const todos = JSON.parse(localStorage.getItem('todos')) || [];
//   todos.forEach(todo => addTodoToDOM(todo));
// }

// window.onload = loadTodos;

// function loadCompleted() {
//   const todos = JSON.parse(localStorage.getItem('todosCompleted')) || [];
//   todos.forEach(todo => controllerTodo.moveTodoToCompleted(todo));
// }

// window.onload = loadCompleted;

//PEDRO!
const videoElement = document.getElementById('video-tag');
const unmuteButton = document.getElementById('unmute-button');

document.addEventListener('DOMContentLoaded', function () {
  let typedWord = '';
  document.addEventListener('keydown', function (event) {
    typedWord += event.key.toLowerCase();
    if (typedWord.includes('pedro')) {
      const videoSource = document.getElementById('video-source');
      videoSource.src = './assets/video/pedro.mp4';
      unmuteButton.style.visibility = 'visible';
      videoElement.load();
      videoElement.play();
      typedWord = '';
    }
  });
});

unmuteButton.addEventListener('click', function () {
  if (videoElement.muted) {
    videoElement.muted = false;
    unmuteButton.textContent = '🔊';
  } else {
    videoElement.muted = true;
    unmuteButton.textContent = '🔈';
  }
});
