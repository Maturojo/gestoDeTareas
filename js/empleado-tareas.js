document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeOriginal = urlParams.get('empleado');
    const normalizedEmployee = normalizeString(employeeOriginal);

    const employeeName = document.getElementById('employee-name');
    const employeeTaskList = document.getElementById('employee-task-list');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    employeeName.textContent = `Tareas de ${employeeOriginal}`;

    renderEmployeeTasks();

    function renderEmployeeTasks() {
        employeeTaskList.innerHTML = '';

        const myTasks = tasks.filter(task => normalizeString(task.owner) === normalizedEmployee);
        myTasks.sort((a, b) => a.priority - b.priority);

        const today = new Date();
        let pending = 0;
        let overdue = 0;

        myTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(`priority-${task.priority}`);

            if (task.dueDate) {
                const dueDateObj = new Date(task.dueDate);
                const diffInDays = (dueDateObj - today) / (1000 * 60 * 60 * 24);
                if (dueDateObj < today) {
                    li.classList.add('vencida');
                    overdue++;
                } else if (diffInDays <= 2 && diffInDays >= 0) {
                    li.classList.add('proxima');
                }
            }

            if (task.completed) {
                li.classList.add('completed');
            } else {
                pending++;
            }

            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
                <p><strong>Prioridad:</strong> ${task.priority}</p>
                <p><strong>Vence:</strong> ${task.dueDate || 'Sin fecha'}</p>
                <button class="complete-btn">${task.completed ? 'Desmarcar' : 'Completar'}</button>
            `;

            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderEmployeeTasks();
            });

            employeeTaskList.appendChild(li);
        });

        // Mostrar observación general (editable por empleado)
        const observaciones = JSON.parse(localStorage.getItem('observaciones')) || {};
        const observacionText = observaciones[employeeOriginal] || '';

        const obsSection = document.createElement('div');
        obsSection.style.marginTop = '2rem';

        const obsLabel = document.createElement('label');
        obsLabel.innerHTML = '<strong>Mi observación general:</strong>';
        obsLabel.style.display = 'block';

        const obsTextarea = document.createElement('textarea');
        obsTextarea.classList.add('obs-textarea');
        obsTextarea.value = observacionText;
        obsTextarea.style.width = '100%';
        obsTextarea.style.minHeight = '60px';
        obsTextarea.style.marginTop = '0.5rem';

        obsTextarea.addEventListener('input', () => {
            observaciones[employeeOriginal] = obsTextarea.value;
            localStorage.setItem('observaciones', JSON.stringify(observaciones));
        });

        obsSection.appendChild(obsLabel);
        obsSection.appendChild(obsTextarea);

        employeeTaskList.appendChild(obsSection);

        document.getElementById('emp-total-tasks').textContent = myTasks.length;
        document.getElementById('emp-pending-tasks').textContent = pending;
        document.getElementById('emp-overdue-tasks').textContent = overdue;
    }

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
