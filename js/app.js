/* AUTH.JS - Handles Google Login & Email/Password Login 
   Author: Sagar Dulal
*/

// 1. Toggle Password Visibility
function togglePasswordVisibility() {
    const passInput = document.getElementById('login-pass');
    const icon = document.getElementById('eye-icon');
    if (passInput.type === "password") {
        passInput.type = "text";
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passInput.type = "password";
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// 2. Handle Google Login Response
async function handleCredentialResponse(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        type: 'google'
    };

    showToast("Logging in with Google...");
    await syncUser(user);
    localStorage.setItem('todo_user', JSON.stringify(user));
    initApp();
}

// 3. Handle Standard Email/Password Form
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;
    const remember = document.getElementById('remember-me').checked;

    const user = {
        id: btoa(email).substring(0, 10), // Create a unique ID from email
        name: email.split('@')[0],
        email: email,
        password: password,
        picture: `https://ui-avatars.com/api/?name=${email}&background=random`,
        type: 'custom'
    };

    showToast("Syncing account...");
    const res = await syncUser(user);
    
    if (res.success) {
        if (remember) localStorage.setItem('todo_remember', 'true');
        localStorage.setItem('todo_user', JSON.stringify(user));
        initApp();
    } else {
        showToast("Error saving to sheet!", "error");
    }
};

// 4. Sync with Google Sheets
async function syncUser(user) {
    return await apiRequest({ action: 'syncUser', user: user });
}

// 5. Check Session on Load
window.onload = () => {
    const savedUser = localStorage.getItem('todo_user');
    const remember = localStorage.getItem('todo_remember');
    
    // If "Remember Me" was checked, log in automatically
    if (savedUser && (remember === 'true')) {
        initApp();
    }
};

// 6. Logout Function
function logout() {
    localStorage.removeItem('todo_user');
    localStorage.removeItem('todo_remember');
    location.reload();
}
