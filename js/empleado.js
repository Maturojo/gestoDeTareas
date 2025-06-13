document.addEventListener('DOMContentLoaded', () => {
    const employeeSelector = document.getElementById('employee-selector');
    const employeeTaskList = document.getElementById('employee-task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    employeeSelector.addEventListener('change', () => {
        renderEmployeeTasks(employeeSelector.value);
    });

    function renderEmployeeTasks(employee) {
        employeeTaskList.innerHTML = '';

        const myTasks = tasks.filter(task => 
            task.owner?.trim().toLowerCase() === employee.trim().toLowerCase()
        );

        myTasks.sort((a, b) => a.priority - b.priority);

        if (myTasks.length === 0) {
            employeeTaskList.innerHTML = '<p>No hay tareas asignadas</p>';
            renderEmployeeDashboard(myTasks);
            return;
        }

        const today = new Date();

        myTasks.forEach(task => {
            const li = document.createElement('li');

            li.classList.add(`priority-${task.priority}`);
            if (task.completed) {
                li.classList.add('completed');
            }

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

        renderEmployeeDashboard(myTasks);
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

    function renderEmployeeDashboard(myTasks) {
        const total = myTasks.length;
        const pending = myTasks.filter(task => !task.completed).length;

        const today = new Date();
        const overdue = myTasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDateObj = new Date(task.dueDate);
            return dueDateObj < today && !task.completed;
        }).length;

        document.getElementById('emp-total-tasks').textContent = total;
        document.getElementById('emp-pending-tasks').textContent = pending;
        document.getElementById('emp-overdue-tasks').textContent = overdue;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
