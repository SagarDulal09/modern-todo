// js/api.js
const API_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE"; 

async function apiRequest(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data) // Google Apps Script requires this
    });
    return await response.json();
}
