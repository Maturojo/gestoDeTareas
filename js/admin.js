document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskOwner = document.getElementById('task-owner');
    const taskPriority = document.getElementById('task-priority');
    const taskDueDate = document.getElementById('task-dueDate');
    const employeeSections = document.getElementById('employee-sections');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const employees = ["Matias", "Facundo", "Ariel", "Guillermo"];

    renderEmployees();
    updateDashboard();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTask = {
            id: Date.now(),
            title: taskTitle.value.trim(),
            desc: taskDesc.value.trim(),
            owner: normalizeString(taskOwner.value),
            priority: parseInt(taskPriority.value),
            dueDate: taskDueDate.value,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        taskForm.reset();
        renderEmployees();
        updateDashboard();
    });

    function renderEmployees() {
        const openSections = new Set(
            Array.from(document.querySelectorAll('.employee-name.open')).map(h => h.textContent)
        );

        employeeSections.innerHTML = '';

        employees.forEach(employee => {
            const section = document.createElement('div');
            section.classList.add('employee-section');

            const header = document.createElement('h2');
            header.classList.add('employee-name');
            header.textContent = employee;

            const taskList = document.createElement('ul');
            taskList.classList.add('task-list-admin'); // Sin 'closed'

            const employeeTasks = tasks.filter(task => normalizeString(task.owner) === normalizeString(employee));
            employeeTasks.sort((a, b) => a.priority - b.priority);

            employeeTasks.forEach(task => {
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

                li.querySelector('.complete-btn').addEventListener('click', () => {
                    task.completed = !task.completed;
                    saveTasks();
                    renderEmployees();
                    updateDashboard();
                });

                li.querySelector('.delete-btn').addEventListener('click', () => {
                    tasks = tasks.filter(t => t.id !== task.id);
                    saveTasks();
                    renderEmployees();
                    updateDashboard();
                });

                taskList.appendChild(li);
            });

            header.addEventListener('click', () => {
                header.classList.toggle('open');
                taskList.classList.toggle('open');
            });

            if (openSections.has(employee)) {
                header.classList.add('open');
                taskList.classList.add('open');
            }

            section.appendChild(header);
            section.appendChild(taskList);
            employeeSections.appendChild(section);
        });
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

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function normalizeString(str) {
        return str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    }
});
