function handleCredentialResponse(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture
    };

    localStorage.setItem('todo_user', JSON.stringify(user));
    syncUser(user);
    initApp();
}

async function syncUser(user) {
    await apiRequest({ action: 'syncUser', user });
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('todo_user'));
    if (user) {
        initApp();
    }
}

function logout() {
    localStorage.removeItem('todo_user');
    location.reload();
}

window.onload = checkAuth;