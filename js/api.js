// js/api.js
const API_URL = "https://script.google.com/macros/s/AKfycbxBnJA-bySZumgVenlMExqcVZUsUSdo3Efxywx_lHL6pFeNXQ6Uxg4bUz2fwKYw9ohJaw/exec"; 

async function apiRequest(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data) // Google Apps Script requires this
    });
    return await response.json();
}
