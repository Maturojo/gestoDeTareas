document.addEventListener('DOMContentLoaded', () => {
    const employeeSelector = document.getElementById('employee-selector');
    const employeeTaskList = document.getElementById('employee-task-list');
    const empTotalTasks = document.getElementById('emp-total-tasks');
    const empPendingTasks = document.getElementById('emp-pending-tasks');
    const empOverdueTasks = document.getElementById('emp-overdue-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    employeeSelector.addEventListener('change', () => {
        renderEmployeeTasks(employeeSelector.value);
    });

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    }

    function renderEmployeeTasks(employee) {
        employeeTaskList.innerHTML = '';

        const myTasks = tasks.filter(task => 
            normalizeString(task.owner) === normalizeString(employee)
        );

        myTasks.sort((a, b) => a.priority - b.priority);

        if (myTasks.length === 0) {
            employeeTaskList.innerHTML = '<p>No hay tareas asignadas</p>';
            renderDashboard(myTasks);
            return;
        }

        const today = new Date();

        myTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(`priority-${task.priority}`);

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
            `;

            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderEmployeeTasks(employee);
            });

            employeeTaskList.appendChild(li);
        });

        renderDashboard(myTasks);
    }

    function renderDashboard(myTasks) {
        const total = myTasks.length;
        const pending = myTasks.filter(task => !task.completed).length;
        const today = new Date();
        const overdue = myTasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDateObj = new Date(task.dueDate);
            return dueDateObj < today && !task.completed;
        }).length;

        empTotalTasks.textContent = total;
        empPendingTasks.textContent = pending;
        empOverdueTasks.textContent = overdue;
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
