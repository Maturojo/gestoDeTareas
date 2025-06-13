document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskList = document.getElementById('task-list');

    // Cargar tareas desde localStorage al iniciar
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    renderTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitle.value.trim();
        const desc = taskDesc.value.trim();

        if (title === '') {
            alert('Por favor ingresa un título');
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            desc,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
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
