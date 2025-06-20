import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const employees = ["Matias", "Facundo", "Ariel", "Guillermo"];
    const puestos = {
        Matias: "WhatsApp",
        Facundo: "Taller",
        Ariel: "Logística",
        Guillermo: "Cortes"
    };

    const cardsContainer = document.getElementById('employee-cards');

    const tasks = await fetchTasks();

    employees.forEach(employee => {
        const myTasks = tasks.filter(task => normalizeString(task.owner) === normalizeString(employee));
        const pending = myTasks.filter(task => !task.completed).length;
        const completed = myTasks.filter(task => task.completed).length;
        const puesto = puestos[employee] || '';

        const card = document.createElement('div');
        card.classList.add('employee-card');

        card.innerHTML = `
            <h3>${employee}</h3>
            <p class="puesto">${puesto}</p>
            <p>Pendientes: ${pending}</p>
            <p>Completadas: ${completed}</p>
        `;

        card.addEventListener('click', () => {
            window.location.href = `empleado-tareas.html?empleado=${encodeURIComponent(employee)}`;
        });

        cardsContainer.appendChild(card);
    });

    async function fetchTasks() {
        try {
            const res = await fetch(`${API_BASE_URL}/tasks`);
            return await res.json();
        } catch (err) {
            console.error('Error cargando tareas:', err);
            return [];
        }
    }

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    }
});
