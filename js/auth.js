// This function waits for the page to be 100% ready
document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');

    // ONLY run this if we are on the login screen
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault(); // Stop page refresh
            
            // 1. Get user input
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-pass').value;
            const remember = document.getElementById('remember-me').checked;

            // 2. Visual Feedback
            showToast("Syncing with Google Sheets...");

            // 3. Prepare User Object
            const user = {
                id: btoa(email).substring(0, 10), 
                name: email.split('@')[0],
                email: email,
                password: password,
                picture: `https://ui-avatars.com/api/?name=${email}&background=random`,
                type: 'custom'
            };

            try {
                // 4. Send to Google Sheets (via api.js)
                const res = await apiRequest({ action: 'syncUser', user: user });

                if (res && res.success) {
                    if (remember) localStorage.setItem('todo_remember', 'true');
                    localStorage.setItem('todo_user', JSON.stringify(user));
                    
                    showToast("Login Successful!");
                    initApp(); // Switch to dashboard
                } else {
                    alert("Database Error: Check your Apps Script deployment.");
                }
            } catch (err) {
                console.error(err);
                alert("Connection Failed. Is your API_URL correct in api.js?");
            }
        };
    }
});

// Password visibility toggle (keep this outside)
function togglePasswordVisibility() {
    const passInput = document.getElementById('login-pass');
    const icon = document.getElementById('eye-icon');
    if (passInput.type === "password") {
        passInput.type = "text";
        icon.className = "fas fa-eye-slash";
    } else {
        passInput.type = "password";
        icon.className = "fas fa-eye";
    }
}

// Keep your handleCredentialResponse (Google Login) here as well...
async function handleCredentialResponse(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        type: 'google'
    };
    await apiRequest({ action: 'syncUser', user: user });
    localStorage.setItem('todo_user', JSON.stringify(user));
    initApp();
}
