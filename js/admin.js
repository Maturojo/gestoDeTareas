document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskOwner = document.getElementById('task-owner');
    const taskPriority = document.getElementById('task-priority');
    const taskDueDate = document.getElementById('task-due-date');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('#filters button');
    const assignedCounters = document.getElementById('assigned-counters');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    renderTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitle.value.trim();
        const desc = taskDesc.value.trim();
        const owner = taskOwner.value;
        const priority = parseInt(taskPriority.value);
        const dueDate = taskDueDate.value;

        if (title === '') {
            alert('Por favor ingresa un título');
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            desc,
            owner,
            priority,
            dueDate,
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

        filteredTasks.sort((a, b) => a.priority - b.priority);

        const today = new Date();

        filteredTasks.forEach(task => {
            const li = document.createElement('li');

            li.classList.add(`priority-${task.priority}`);
            if (task.completed) {
                li.classList.add('completed');
            }

            // Verificar fechas de vencimiento
            if (task.dueDate) {
                const dueDateObj = new Date(task.dueDate);
                const diffInDays = (dueDateObj - today) / (1000 * 60 * 60 * 24);

                if (dueDateObj < today && !task.completed) {
                    li.classList.add('vencida');
                } else if (diffInDays <= 2 && diffInDays >= 0 && !task.completed) {
                    li.classList.add('proxima');
                }
            }

            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
                <p><strong>Asignado a:</strong> ${task.owner || 'No asignado'}</p>
                <p><strong>Prioridad:</strong> ${task.priority}</p>
                <p><strong>Vence:</strong> ${task.dueDate || 'Sin fecha'}</p>
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

        renderCounters();
    }

    function renderCounters() {
        assignedCounters.innerHTML = '';

        const counts = {};

        tasks.forEach(task => {
            if (!task.completed) {
                const owner = task.owner || 'No asignado';
                counts[owner] = (counts[owner] || 0) + 1;
            }
        });

        for (const owner in counts) {
            const p = document.createElement('p');
            p.textContent = `${owner}: ${counts[owner]} tareas pendientes`;
            assignedCounters.appendChild(p);
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
