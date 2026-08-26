const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const messageBox = document.getElementById('messageBox');
const dashboardData = document.getElementById('dashboardData');

// Utility to show messages
function showMessage(msg, isError = false) {
    messageBox.textContent = msg;
    messageBox.style.color = isError ? '#ff4d4d' : '#00e676';
    messageBox.classList.remove('hidden');
    setTimeout(() => messageBox.classList.add('hidden'), 3000);
}

// 1. Register User
async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    showMessage(data.message, !res.ok);
}

// 2. Login User
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok) {
        // Standard Mechanism: Store JWT in localStorage
        localStorage.setItem('token', data.token);
        showMessage('Login successful!');
        checkAuth(); // Switch to dashboard
    } else {
        showMessage(data.message, true);
    }
}

// 3. Access Protected Route (Dashboard)
async function fetchDashboard() {
    const token = localStorage.getItem('token');
    
    // Attach token to Authorization header
    const res = await fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok) {
        dashboardData.innerHTML = `
            <strong>Status:</strong> ${data.message}<br><br>
            <strong>Logged in as:</strong> ${data.user.username}<br>
            <strong>Role:</strong> ${data.user.role}
        `;
    } else {
        showMessage(data.message, true);
        logout();
    }
}

// 4. Logout
function logout() {
    localStorage.removeItem('token');
    checkAuth();
}

// 5. Check Authentication State on Load
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        fetchDashboard();
    } else {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// Run on page load
checkAuth();