document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-pass');
            
            if (!emailInput || !passInput) {
                console.error("Inputs not found!");
                return;
            }

            const email = emailInput.value;
            const password = passInput.value;
            const remember = document.getElementById('remember-me').checked;

            // This now works because app.js loaded first!
            showToast("Authenticating...");

            const user = {
                id: btoa(email).substring(0, 10),
                name: email.split('@')[0],
                email: email,
                password: password,
                picture: `https://ui-avatars.com/api/?name=${email}&background=random`,
                type: 'custom'
            };

            try {
                const res = await apiRequest({ action: 'syncUser', user: user });
                if (res && res.success) {
                    if (remember) localStorage.setItem('todo_remember', 'true');
                    localStorage.setItem('todo_user', JSON.stringify(user));
                    showToast("Login Success!");
                    setTimeout(() => { location.reload(); }, 500); // Refresh to trigger initApp
                } else {
                    showToast("Server Error. Check Sheet.", "error");
                }
            } catch (err) {
                showToast("Connection failed.", "error");
            }
        };
    }
});

// Helper for Google Login
async function handleCredentialResponse(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        type: 'google'
    };
    showToast("Google Syncing...");
    await apiRequest({ action: 'syncUser', user: user });
    localStorage.setItem('todo_user', JSON.stringify(user));
    location.reload();
}
function checkSession() {
    const user = localStorage.getItem('todo_user');
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');

    if (user) {
        if(loginScreen) loginScreen.classList.add('hidden');
        if(appScreen) appScreen.classList.remove('hidden');
        
        // Ensure app.js is ready before calling initApp
        if (typeof initApp === "function") {
            initApp(); 
        }
    } else {
        if(loginScreen) loginScreen.classList.remove('hidden');
        if(appScreen) appScreen.classList.add('hidden');
    }
}

// Run session check on every page load
window.addEventListener('load', checkSession);
