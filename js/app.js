let currentListId = null;

function initApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    const user = JSON.parse(localStorage.getItem('todo_user'));
    document.getElementById('user-pic').src = user.picture;
    loadLists();
}

async function loadLists() {
    const user = JSON.parse(localStorage.getItem('todo_user'));
    const res = await apiRequest({ action: 'getLists', userId: user.id });
    const container = document.getElementById('list-container');
    container.innerHTML = '';

    res.lists.forEach(list => {
        const li = document.createElement('li');
        li.className = `p-2 rounded-lg cursor-pointer flex justify-between group ${currentListId === list.id ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-slate-100'}`;
        li.innerHTML = `
            <span onclick="selectList('${list.id}', '${list.title}')">${list.title}</span>
            <button onclick="deleteList('${list.id}')" class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><i class="fas fa-trash-alt"></i></button>
        `;
        container.appendChild(li);
    });
}

async function createNewList() {
    const title = prompt("Enter List Name:");
    if (!title) return;
    const user = JSON.parse(localStorage.getItem('todo_user'));
    await apiRequest({ action: 'addList', userId: user.id, title });
    loadLists();
}

async function selectList(id, title) {
    currentListId = id;
    document.getElementById('active-list-title').innerText = title;
    document.getElementById('task-form').classList.remove('hidden');
    document.getElementById('empty-state').classList.add('hidden');
    loadLists(); // Refresh active state
    loadTasks();
}

async function loadTasks() {
    document.getElementById('task-loader').classList.remove('hidden');
    const res = await apiRequest({ action: 'getTasks', listId: currentListId });
    document.getElementById('task-loader').classList.add('hidden');

    const container = document.getElementById('task-container');
    container.innerHTML = '';
    res.tasks.forEach(task => renderTask(task));
}

function renderTask(task) {
    const container = document.getElementById('task-container');
    const li = document.createElement('li');
    li.className = "bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between animate-slide-in";
    li.innerHTML = `
        <div class="flex items-center gap-3">
            <input type="checkbox" ${task.status === 'complete' ? 'checked' : ''} 
                onchange="toggleTask('${task.id}', this.checked)" class="w-5 h-5 accent-indigo-600">
            <span class="${task.status === 'complete' ? 'line-through text-slate-400' : ''}">${task.text}</span>
            <span class="text-xs text-slate-400">${task.dueDate || ''}</span>
        </div>
        <button onclick="deleteTask('${task.id}')" class="text-slate-300 hover:text-red-500"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(li);
}

document.getElementById('task-form').onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const dateInput = document.getElementById('task-date');
    const task = { listId: currentListId, text: input.value, dueDate: dateInput.value };

    await apiRequest({ action: 'addTask', task });
    input.value = '';
    loadTasks();
    showToast("Task added!");
};

async function toggleTask(id, checked) {
    await apiRequest({ action: 'updateTask', taskId: id, updates: { status: checked ? 'complete' : 'incomplete' } });
    loadTasks();
}

async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;
    await apiRequest({ action: 'deleteTask', taskId: id });
    loadTasks();
}

async function deleteList(id) {
    if (!confirm("Delete entire list and all its tasks?")) return;
    await apiRequest({ action: 'deleteList', listId: id });
    currentListId = null;
    location.reload();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.transform = 'translateY(0)';
    setTimeout(() => toast.style.transform = 'translateY(100px)', 3000);
}
// Dark Mode Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('todo_theme', isDark ? 'dark' : 'light');
});

// Load saved theme on startup
if (localStorage.getItem('todo_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}