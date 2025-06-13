document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskPriority = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('#filters button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    renderTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitle.value.trim();
        const desc = taskDesc.value.trim();
        const priority = taskPriority.value;

        if (title === '') {
            alert('Por favor ingresa un título');
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            desc,
            priority,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    function renderTasks() {
        taskList.innerHTML = '';

        let filteredTasks = tasks;

        if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `${task.completed ? 'completed' : ''} ${task.priority}`;

            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
                <p><strong>Prioridad:</strong> ${task.priority}</p>
                <button class="complete-btn">${task.completed ? 'Desmarcar' : 'Completar'}</button>
                <button class="delete-btn">Eliminar</button>
            `;

            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
