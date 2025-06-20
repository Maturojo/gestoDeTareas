import { API_BASE_URL } from './config.js';
import Toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeOriginal = urlParams.get('empleado');
    const normalizedEmployee = normalizeString(employeeOriginal);

    const employeeName = document.getElementById('employee-name');
    const employeeTaskList = document.getElementById('employee-task-list');

    employeeName.textContent = `Tareas de ${employeeOriginal}`;

    let tasks = await fetchTasks();
    renderEmployeeTasks(tasks);

    async function fetchTasks() {
        try {
            const res = await fetch(`${API_BASE_URL}/tasks`);
            return await res.json();
        } catch (err) {
            console.error('Error obteniendo tareas:', err);
            return [];
        }
    }

    async function renderEmployeeTasks(tasks) {
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

            li.querySelector('.complete-btn').addEventListener('click', async () => {
                try {
                    await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed: !task.completed })
                    });
                    tasks = await fetchTasks();
                    renderEmployeeTasks(tasks);

                    Toastify({
                        text: !task.completed ? "Tarea completada ✅" : "Tarea marcada como pendiente",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "#4CAF50"
                        }
                    }).showToast();
                } catch (error) {
                    console.error('Error actualizando tarea:', error);
                }
            });

            employeeTaskList.appendChild(li);
        });

        // 📌 Observación del empleado
        const obsSection = document.createElement('div');
        obsSection.style.marginTop = '2rem';

        const obsLabel = document.createElement('label');
        obsLabel.innerHTML = '<strong>Mi observación general:</strong>';
        obsLabel.style.display = 'block';

        const obsTextarea = document.createElement('textarea');
        obsTextarea.classList.add('obs-textarea');
        obsTextarea.style.width = '100%';
        obsTextarea.style.minHeight = '60px';
        obsTextarea.style.marginTop = '0.5rem';

        try {
            const res = await fetch(`${API_BASE_URL}/observaciones/${employeeOriginal}`);
            const data = await res.json();
            obsTextarea.value = data.text || '';
        } catch (err) {
            console.error('No se pudo cargar la observación');
        }

        obsTextarea.addEventListener('input', async () => {
            try {
                await fetch(`${API_BASE_URL}/observaciones/${employeeOriginal}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: obsTextarea.value })
                });
            } catch (err) {
                console.error('No se pudo guardar la observación');
            }
        });

        obsSection.appendChild(obsLabel);
        obsSection.appendChild(obsTextarea);
        employeeTaskList.appendChild(obsSection);

        document.getElementById('emp-total-tasks').textContent = myTasks.length;
        document.getElementById('emp-pending-tasks').textContent = pending;
        document.getElementById('emp-overdue-tasks').textContent = overdue;
    }

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/\u0300-\u036f/g, '');
    }
});
