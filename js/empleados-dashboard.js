document.addEventListener('DOMContentLoaded', () => {
    const employees = ["Matias", "Facundo", "Ariel", "Guillermo"];
    const cardsContainer = document.getElementById('employee-cards');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    employees.forEach(employee => {
        const myTasks = tasks.filter(task => normalizeString(task.owner) === normalizeString(employee));
        const pending = myTasks.filter(task => !task.completed).length;
        const completed = myTasks.filter(task => task.completed).length;

        const card = document.createElement('div');
        card.classList.add('task-card');
        card.innerHTML = `
            <h3>${employee}</h3>
            <p>Pendientes: ${pending}</p>
            <p>Completadas: ${completed}</p>
            <button class="ver-btn">Ver tareas</button>
        `;

        card.querySelector('.ver-btn').addEventListener('click', () => {
            // 🔧 Corrección de ruta relativa
            window.location.href = `./empleado-tareas.html?empleado=${encodeURIComponent(employee)}`;
        });

        cardsContainer.appendChild(card);
    });

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    }
});
