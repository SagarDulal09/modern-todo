const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

async function apiRequest(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        showToast("Error connecting to server", "error");
        console.error("API Error:", error);
    }
}