// Esperamos que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskList = document.getElementById('task-list');

    // Creamos un array para almacenar las tareas
    let tasks = [];

    // Manejar el submit del formulario
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitle.value.trim();
        const desc = taskDesc.value.trim();

        if (title === '') {
            alert('Por favor ingresa un título');
            return;
        }

        const newTask = {
            id: Date.now(), // ID único
            title,
            desc,
            completed: false
        };

        tasks.push(newTask);
        renderTasks();
        taskForm.reset();
    });

    // Función para mostrar las tareas
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

            // Marcar como completada o no
            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                renderTasks();
            });

            // Eliminar tarea
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }
});
