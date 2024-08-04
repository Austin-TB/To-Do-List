const taskListContainer = document.querySelector('.task-list-container');
const taskInput = document.querySelector('#task-input');
const dateInput = document.querySelector('#date-input');
const timeInput = document.querySelector('#time-input');
const emptyListMessage = document.querySelector('.empty-list');
let datesWithTasks = [];

if (datesWithTasks.length === 0) {
    emptyListMessage.style.display = 'block';
} else {
    emptyListMessage.style.display = 'none';
}

document.querySelector('.add-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' &&
        taskInput.value &&
        dateInput.value &&
        timeInput.value) {
        addTask();
    }
});

function addTask() {
    const task = taskInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    if (datesWithTasks.includes(date)) {
        const taskList = document.querySelector(`.task-list[data-date="${date}"]`);
        taskList.innerHTML += `
            <div class="task">
                <div class="task-content">
                    <input type="checkbox" id="checkbox" name="checkbox">
                    <label for="checkbox">${task}</label>
                    <p>${time}</p>
                </div>
                <button class="delete-task" onclick="deleteTask(this)">X</button>
            </div>
        `;
    } else {
        taskListContainer.innerHTML += `
            <div class="task-list[data-date="${date}"]">
                <h2>${date}</h2>
                <div class="task">
                    <div class="task-content">
                    <input type="checkbox" id="checkbox" name="checkbox">
                    <label for="checkbox">${task}</label>
                        <p>${time}</p>
                    </div>
                    <button class="delete-task" onclick="deleteTask(this)">X</button>
                </div>
            </div>
        `;
        datesWithTasks.push(date);
    }

    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
    emptyListMessage.style.display = 'none';
}
function deleteTask(task) {
    task.parentElement.remove();
    if (taskListContainer.innerHTML === '') {
        emptyListMessage.style.display = 'block';
    }
}