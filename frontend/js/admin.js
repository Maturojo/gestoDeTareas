import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskOwner = document.getElementById('task-owner');
    const taskPriority = document.getElementById('task-priority');
    const taskDueDate = document.getElementById('task-dueDate');
    const employeeSections = document.getElementById('employee-sections');

    const empleadosConPuesto = {
        Matias: "Whatsapp",
        Facundo: "Tienda",
        Ariel: "Producción",
        Guillermo: "Delivery"
    };

    let tasks = await fetchTasks();
    renderEmployees();
    updateDashboard();

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newTask = {
            title: taskTitle.value.trim(),
            desc: taskDesc.value.trim(),
            owner: taskOwner.value.trim(),
            priority: parseInt(taskPriority.value),
            dueDate: taskDueDate.value,
            completed: false,
        };

        await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        tasks = await fetchTasks();
        taskForm.reset();
        renderEmployees();
        updateDashboard();

        showToast("Tarea agregada ✅");
    });

    async function fetchTasks() {
        const res = await fetch(`${API_BASE_URL}/tasks`);
        return await res.json();
    }

    async function renderEmployees() {
        const openSections = new Set(
            Array.from(document.querySelectorAll('.employee-name.open')).map(h => h.textContent)
        );

        employeeSections.innerHTML = '';

        for (const employee in empleadosConPuesto) {
            const puesto = empleadosConPuesto[employee];
            const section = document.createElement('div');
            section.classList.add('employee-section');

            const header = document.createElement('h2');
            header.classList.add('employee-name');
            header.textContent = `${employee} / ${puesto}`;

            const taskList = document.createElement('ul');
            taskList.classList.add('task-list-admin');

            const employeeTasks = tasks.filter(task => normalizeString(task.owner) === normalizeString(employee));
            employeeTasks.sort((a, b) => a.priority - b.priority);

            for (const task of employeeTasks) {
                const li = document.createElement('li');
                li.classList.add(`priority-${task.priority}`);

                if (task.dueDate) {
                    const today = new Date();
                    const dueDateObj = new Date(task.dueDate);
                    const diffInDays = (dueDateObj - today) / (1000 * 60 * 60 * 24);
                    if (dueDateObj < today) {
                        li.classList.add('vencida');
                    } else if (diffInDays <= 2) {
                        li.classList.add('proxima');
                    }
                }

                if (task.completed) li.classList.add('completed');

                li.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.desc}</p>
                    <p><strong>Prioridad:</strong> ${task.priority}</p>
                    <p><strong>Vence:</strong> ${task.dueDate || 'Sin fecha'}</p>
                    <button class="complete-btn">${task.completed ? 'Desmarcar' : 'Completar'}</button>
                    <button class="delete-btn">Eliminar</button>
                `;

                li.querySelector('.complete-btn').addEventListener('click', async () => {
                    await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed: !task.completed })
                    });
                    tasks = await fetchTasks();
                    renderEmployees();
                    updateDashboard();
                    showToast(task.completed ? "Tarea desmarcada 🔁" : "Tarea completada ✅");
                });

                li.querySelector('.delete-btn').addEventListener('click', async () => {
                    await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
                        method: 'DELETE'
                    });
                    tasks = await fetchTasks();
                    renderEmployees();
                    updateDashboard();
                    showToast("Tarea eliminada ❌");
                });

                taskList.appendChild(li);
            }

            const obsLabel = document.createElement('label');
            obsLabel.innerHTML = '<strong>Observaciones generales:</strong>';
            obsLabel.style.display = 'block';
            obsLabel.style.marginTop = '1rem';

            const obsTextarea = document.createElement('textarea');
            obsTextarea.classList.add('obs-textarea');
            obsTextarea.placeholder = 'Observación general del empleado...';
            obsTextarea.style.marginBottom = '1rem';

            try {
                const res = await fetch(`${API_BASE_URL}/observaciones/${employee}`);
                const data = await res.json();
                obsTextarea.value = data.text || '';
            } catch {
                obsTextarea.value = '';
            }

            obsTextarea.addEventListener('input', async () => {
                await fetch(`${API_BASE_URL}/observaciones/${employee}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: obsTextarea.value })
                });
            });

            section.appendChild(header);
            section.appendChild(taskList);
            section.appendChild(obsLabel);
            section.appendChild(obsTextarea);
            employeeSections.appendChild(section);

            header.addEventListener('click', () => {
                header.classList.toggle('open');
                taskList.classList.toggle('open');
                obsTextarea.classList.toggle('open');
            });

            if (openSections.has(`${employee} / ${puesto}`)) {
                header.classList.add('open');
                taskList.classList.add('open');
                obsTextarea.classList.add('open');
            }
        }
    }

    function updateDashboard() {
        const total = tasks.length;
        const pending = tasks.filter(task => !task.completed).length;
        const overdue = tasks.filter(task => {
            if (!task.dueDate) return false;
            return new Date(task.dueDate) < new Date() && !task.completed;
        }).length;

        document.getElementById('total-tasks').textContent = total;
        document.getElementById('pending-tasks').textContent = pending;
        document.getElementById('overdue-tasks').textContent = overdue;
    }

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/\u0300-\u036f/g, '');
    }

    function showToast(message) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#333",
            stopOnFocus: true
        }).showToast();
    }
});
