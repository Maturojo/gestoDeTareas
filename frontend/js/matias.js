// 📁 js/matias.js
import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const taskList = document.getElementById('employee-task-list');
    const totalSpan = document.getElementById('emp-total-tasks');
    const pendingSpan = document.getElementById('emp-pending-tasks');
    const overdueSpan = document.getElementById('emp-overdue-tasks');

    let tasks = await fetchTasks();
    renderTasks(tasks);

    async function fetchTasks() {
        try {
            const res = await fetch(`${API_BASE_URL}/tasks`);
            const allTasks = await res.json();
            return allTasks.filter(task => normalize(task.owner) === 'matias');
        } catch (err) {
            console.error('Error cargando tareas:', err);
            return [];
        }
    }

    async function renderTasks(tasks) {
        taskList.innerHTML = '';
        const today = new Date();

        const pendientes = tasks.filter(t => !t.completed);
        const vencidas = pendientes.filter(t => t.dueDate && new Date(t.dueDate) < today);

        totalSpan.textContent = tasks.length;
        pendingSpan.textContent = pendientes.length;
        overdueSpan.textContent = vencidas.length;

        tasks.sort((a, b) => a.priority - b.priority);

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(`priority-${task.priority}`);

            if (task.completed) li.classList.add('completed');

            if (task.dueDate) {
                const due = new Date(task.dueDate);
                const diff = (due - today) / (1000 * 60 * 60 * 24);
                if (due < today) li.classList.add('vencida');
                else if (diff <= 2) li.classList.add('proxima');
            }

            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc || ''}</p>
                <p><strong>Prioridad:</strong> ${task.priority}</p>
                <p><strong>Vence:</strong> ${task.dueDate || 'Sin fecha'}</p>
                <button class="complete-btn">${task.completed ? 'Desmarcar' : 'Completar'}</button>
                
            `;

            li.querySelector('.complete-btn').addEventListener('click', async () => {
                await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: !task.completed })
                });
                tasks = await fetchTasks();
                renderTasks(tasks);
                showToast(task.completed ? "Tarea desmarcada 🔁" : "Tarea completada ✅");
            });

            li.querySelector('.delete-btn').addEventListener('click', async () => {
                await fetch(`${API_BASE_URL}/tasks/${task._id}`, { method: 'DELETE' });
                tasks = await fetchTasks();
                renderTasks(tasks);
                showToast("Tarea eliminada ❌");
            });

            taskList.appendChild(li);
        });
    }

    function normalize(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
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
