const taskListContainer = document.querySelector('.task-list-container');
const taskInput = document.querySelector('#task-input');
const dateInput = document.querySelector('#date-input');
const calendarButton = document.querySelector('#calendar');
const timeInput = document.querySelector('#time-input');
const timeButton = document.querySelector('#time-select');
const emptyListMessage = document.querySelector('.empty-list');
let datesWithTasks = [];

function todaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

dateInput.value = todaysDate();

function isListEmpty() {
    if (datesWithTasks.length === 0) {  
        emptyListMessage.style.display = 'block';
    } else {
        emptyListMessage.style.display = 'none';
    }
}

function saveTasks() {
    localStorage.setItem('tasks', taskListContainer.innerHTML);
    localStorage.setItem('datesWithTasks', JSON.stringify(datesWithTasks));
}

function addEventListenersToTasks() {
    const optionsButtons = document.querySelectorAll('.options-button');
    optionsButtons.forEach(button => {
        button.addEventListener('click', toggleOptionsMenu);
    });

    const editButtons = document.querySelectorAll('.edit-task');
    editButtons.forEach(button => {
        button.addEventListener('click', editTask);
    });

    const deleteButtons = document.querySelectorAll('.delete-task');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            deleteTask(button);
        });
    const toggleButtons = document.querySelectorAll('.toggle-button');
    toggleButtons.forEach(button => {
        button.addEventListener('click', toggleTaskList);
    
    });

    const dateInputFields = document.querySelectorAll('.date-task-input');
    dateInputFields.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && input.value) {
                addTaskToDate(input);
            }
        });
    });

    const dateTimeButtons = document.querySelectorAll('.date-time-button');
    dateTimeButtons.forEach(button => button.addEventListener('click', toggleDateTimeInput));
    });
}

function toggleTaskList(event) {
    const taskList = event.target.closest('.task-list');
    const collapsibleContent = taskList.querySelector('.collapsible-content');
    const toggleButton = event.target;

    collapsibleContent.classList.toggle('collapsed');
    toggleButton.textContent = collapsibleContent.classList.contains('collapsed') ? '▶' : '▼';
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedDates = localStorage.getItem('datesWithTasks');

    if (savedTasks && savedDates) {
        taskListContainer.innerHTML = savedTasks;
        datesWithTasks = JSON.parse(savedDates);

        addEventListenersToTasks();
    }

    isListEmpty();
}

loadTasks();

function addTask() {
    const task = taskInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    addTaskToList(task, date, time);

    taskInput.value = '';
    dateInput.value = todaysDate();
    timeInput.value = '23:59';

    addEventListenersToTasks();
    isListEmpty();
    saveTasks();
}

function addTaskToList(task, date, time) {
    const taskHtml = createTaskHtml(task, time);

    if (datesWithTasks.includes(date)) {
        const taskList = document.querySelector(`.task-list[data-date="${date}"]`);
        const tasksContainer = taskList.querySelector('.tasks-container');
        tasksContainer.innerHTML += taskHtml;
    } else {
        taskListContainer.innerHTML += createDateListHtml(date, taskHtml);
        datesWithTasks.push(date);
    }
}

function createTaskHtml(task, time) {
    return `
        <div class="task">
            <input type="checkbox" id="checkbox" name="checkbox">
            <label for="checkbox">${task}</label>
            <p>${time}</p>
            <div>
                <button class="options-button">⋮</button>
                <div class="options-menu hidden">
                    <button class="edit-task">Edit</button>
                    <button class="delete-task">Delete</button>
                </div>
            </div>
        </div>
    `;
}

function createDateListHtml(date, taskHtml) {
    return `
        <div class="task-list" data-date="${date}">
            <div class="date-header">
                <button class="toggle-button">▼</button>
                <h2>${date}</h2>
            </div>
            <div class="collapsible-content">
                <div class="tasks-container">
                    ${taskHtml}
                </div>
                <div class="date-task-input-container">
                    <input type="text" class="date-task-input" placeholder="Add a task for this date">
                    <button class="date-time-button">Set Time</button>
                    <input type="time" class="date-time-input hidden" value="23:59">
                </div>
            </div>
        </div>
    `;
}

function addTaskToDate(input) {
    const taskList = input.closest('.task-list');
    const date = taskList.getAttribute('data-date');
    const tasksContainer = taskList.querySelector('.tasks-container');
    const timeInput = taskList.querySelector('.date-time-input');
    const task = input.value;
    const time = timeInput.value;

    tasksContainer.innerHTML += createTaskHtml(task, time);
    input.value = '';
    timeInput.value = '23:59';

    addEventListenersToTasks();
    saveTasks();
}

function toggleOptionsMenu(event) {
    const optionsMenu = event.target.nextElementSibling;
    optionsMenu.classList.toggle('hidden');
}

function editTask(event) {
    const taskElement = event.target.closest('.task');
    const taskListElement = taskElement.closest('.task-list');
    const date = taskListElement.getAttribute('data-date');
    const labelElement = taskElement.querySelector('label');
    const timeElement = taskElement.querySelector('p');

    taskInput.value = labelElement.textContent;
    dateInput.value = date;
    timeInput.value = timeElement.textContent;
    deleteTask(event.target);
    taskInput.focus();
}

function deleteTask(deleteButton) {
    const taskElement = deleteButton.closest('.task');
    const taskListElement = deleteButton.closest('.task-list');
    const tasksContainer = taskListElement.querySelector('.tasks-container');
    const date = taskListElement.getAttribute('data-date');

    taskElement.remove();

    if (tasksContainer.querySelectorAll('.task').length === 0) {
        taskListElement.remove();
        datesWithTasks = datesWithTasks.filter(item => item !== date);
    }

    isListEmpty();
    saveTasks();
}

function toggleDateTimeInput(event) {
    const timeInput = event.target.nextElementSibling;
    timeInput.classList.toggle('hidden');
}

calendarButton.addEventListener('click', function () {
    dateInput.classList.toggle('hidden');
});

timeButton.addEventListener('click', function () {
    timeInput.classList.toggle('hidden');
});

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && taskInput.value && dateInput.value && timeInput.value) {
        addTask();
    }
});