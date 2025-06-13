document.addEventListener('DOMContentLoaded', () => {
    const employeeSelector = document.getElementById('employee-selector');
    const employeeTaskList = document.getElementById('employee-task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    employeeSelector.addEventListener('change', () => {
        renderEmployeeTasks(employeeSelector.value);
    });

    function renderEmployeeTasks(employee) {
        employeeTaskList.innerHTML = '';

        const myTasks = tasks.filter(task => task.owner === employee);

        myTasks.sort((a, b) => a.priority - b.priority);

        myTasks.forEach(task => {
            const li = document.createElement('li');

            li.classList.add(`priority-${task.priority}`);
            if (task.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
                <p><strong>Prioridad:</strong> ${task.priority}</p>
                <button class="complete-btn">${task.completed ? 'Desmarcar' : 'Completar'}</button>
            `;

            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderEmployeeTasks(employee);
            });

            employeeTaskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
