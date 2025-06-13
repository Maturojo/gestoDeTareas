document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskOwner = document.getElementById('task-owner');
    const taskPriority = document.getElementById('task-priority');
    const taskDueDate = document.getElementById('task-due-date');
    const employeesContainer = document.getElementById('employees-container');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let openEmployees = [];

    const employees = ["Matias", "Facundo", "Ariel", "Guillermo"];

    renderDashboard();
    renderEmployees();

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
            createdAt: new Date().toISOString(),
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderDashboard();
        renderEmployees();
        taskForm.reset();
    });

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    }

    function renderEmployees() {
        // Guardamos los empleados que están abiertos antes de renderizar
        openEmployees = Array.from(document.querySelectorAll('.employee-name.open')).map(header => header.textContent);

        employeesContainer.innerHTML = '';

        employees.forEach(employee => {
            const employeeDiv = document.createElement('div');
            employeeDiv.classList.add('employee-section');

            const header = document.createElement('h2');
            header.textContent = employee;
            header.classList.add('employee-name');
            header.style.cursor = 'pointer';

            const taskList = document.createElement('ul');
            taskList.classList.add('task-list');

            const myTasks = tasks.filter(task => 
                normalizeString(task.owner) === normalizeString(employee)
            );

            myTasks.sort((a, b) => a.priority - b.priority);

            myTasks.forEach(task => {
                const li = document.createElement('li');
                li.classList.add(`priority-${task.priority}`);

                const today = new Date();
                if (task.dueDate) {
                    const dueDateObj = new Date(task.dueDate);
                    const diffInDays = (dueDateObj - today) / (1000 * 60 * 60 * 24);

                    if (dueDateObj < today) {
                        li.classList.add('vencida');
                    } else if (diffInDays <= 2 && diffInDays >= 0) {
                        li.classList.add('proxima');
                    }
                }

                if (task.completed) {
                    li.classList.add('completed');
                }

                li.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.desc}</p>
                    <p><strong>Prioridad:</strong> ${task.priority}</p>
                    <p><strong>Vence:</strong> ${task.dueDate || 'Sin fecha'}</p>
                    <p><strong>Creada:</strong> ${formatDate(task.createdAt)}</p>
                    <button class="complete-btn">${task.completed ? 'Desmarcar' : 'Completar'}</button>
                    <button class="delete-btn">Eliminar</button>
                `;

                li.querySelector('.complete-btn').addEventListener('click', () => {
                    task.completed = !task.completed;
                    saveTasks();
                    renderDashboard();
                    renderEmployees();
                });

                li.querySelector('.delete-btn').addEventListener('click', () => {
                    tasks = tasks.filter(t => t.id !== task.id);
                    saveTasks();
                    renderDashboard();
                    renderEmployees();
                });

                taskList.appendChild(li);
            });

            if (myTasks.length > 0) {
                header.addEventListener('click', () => {
                    const isOpen = taskList.classList.toggle('open');
                    header.classList.toggle('open', isOpen);
                });
            } else {
                const emptyMsg = document.createElement('p');
                emptyMsg.textContent = "No hay tareas";
                emptyMsg.style.padding = "15px";
                taskList.appendChild(emptyMsg);
            }

            // Si estaba abierto antes, lo abrimos de nuevo
            if (openEmployees.includes(employee)) {
                header.classList.add('open');
                taskList.classList.add('open');
            }

            employeeDiv.appendChild(header);
            employeeDiv.appendChild(taskList);
            employeesContainer.appendChild(employeeDiv);
        });
    }

    function renderDashboard() {
        const total = tasks.length;
        const pending = tasks.filter(task => !task.completed).length;
        const today = new Date();
        const overdue = tasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDateObj = new Date(task.dueDate);
            return dueDateObj < today && !task.completed;
        }).length;

        document.getElementById('total-tasks').textContent = total;
        document.getElementById('pending-tasks').textContent = pending;
        document.getElementById('overdue-tasks').textContent = overdue;
    }

    function formatDate(dateString) {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
