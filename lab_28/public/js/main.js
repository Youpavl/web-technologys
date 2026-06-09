let currentUser = null;

const viewGuest = document.getElementById('view-guest');
const viewUser = document.getElementById('view-user');
const adminPanel = document.getElementById('admin-panel');
const msgEl = document.getElementById('msg');

function showMsg(text, isError) {
    msgEl.textContent = text;
    msgEl.style.background = isError ? '#e74c3c' : '#27ae60';
    msgEl.style.display = 'block';
    setTimeout(() => { msgEl.style.display = 'none'; }, 3000);
}

function showView(view) {
    viewGuest.classList.add('hidden');
    viewUser.classList.add('hidden');

    if (view === 'guest') {
        viewGuest.classList.remove('hidden');
    } else {
        viewUser.classList.remove('hidden');
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-role').textContent = currentUser.role;

        if (currentUser.role === 'admin') {
            adminPanel.classList.remove('hidden');
        } else {
            adminPanel.classList.add('hidden');
        }
    }
}

async function api(url, options = {}) {
    const res = await fetch(url, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error');
    return data;
}

// Registration
async function register(e) {
    e.preventDefault();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;

    if (password !== confirm) {
        showMsg('Passwords do not match!', true);
        return;
    }

    try {
        const data = await api('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password,
                role: document.getElementById('regRole').value
            })
        });
        showMsg(data.message, false);
        e.target.reset();
    } catch (err) {
        showMsg(err.message, true);
    }
}

// Login
async function login(e) {
    e.preventDefault();
    try {
        await api('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            })
        });
        showMsg('Login successful!', false);
        await loadUser();
    } catch (err) {
        showMsg(err.message, true);
    }
}

// User Info
async function getUserInfo() {
    try {
        currentUser = await api('/api/user-info');
        showView('user');
        showMsg('Data updated successfully!', false);
    } catch (err) {
        showMsg(err.message, true);
    }
}

// Admin Info
async function getAdminInfo() {
    try {
        const data = await api('/api/admin');
        const el = document.getElementById('admin-data');
        el.classList.remove('hidden');
        el.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        showMsg(err.message, true);
    }
}

// Refresh token
async function refreshToken() {
    try {
        await api('/api/refresh-token', { method: 'POST' });
        showMsg('Token updated successfully!', false);
    } catch (err) {
        showMsg(err.message, true);
        currentUser = null;
        showView('guest');
    }
}

// Logout
async function logout() {
    try { await api('/api/logout', { method: 'POST' }); } catch {}
    currentUser = null;
    showView('guest');
}

// Initial load
async function loadUser() {
    try {
        currentUser = await api('/api/user-info');
        showView('user');
    } catch {
        showView('guest');
    }
}

loadUser();