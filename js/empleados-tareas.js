document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const employee = urlParams.get('empleado');
    document.getElementById('titulo-empleado').textContent = `Tareas de ${employee}`;

    const employeeTaskList = document.getElementById('employee-task-list');
    const empTotalTasks = document.getElementById('emp-total-tasks');
    const empPendingTasks = document.getElementById('emp-pending-tasks');
    const empOverdueTasks = document.getElementById('emp-overdue-tasks');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const myTasks = tasks.filter(task => normalizeString(task.owner) === normalizeString(employee));
    renderDashboard(myTasks);
    renderTasks(myTasks);

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

    function renderTasks(myTasks) {
        employeeTaskList.innerHTML = '';
        const today = new Date();

        myTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(`priority-${task.priority}`);

            if (task.dueDate) {
                const dueDateObj = new Date(task.dueDate);
                const diffInDays = (dueDateObj - today) / (1000 * 60 * 60 * 24);
                if (dueDateObj < today) li.classList.add('vencida');
                else if (diffInDays <= 2 && diffInDays >= 0) li.classList.add('proxima');
            }

            if (task.completed) li.classList.add('completed');

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
                renderDashboard(myTasks);
                renderTasks(myTasks);
            });

            employeeTaskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function formatDate(dateString) {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    }
});
