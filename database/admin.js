import { db } from './connection.js'
import { showToast, showError } from '../src/ui-notifications.js'

async function login() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const { error } = await db.auth.signInWithPassword({ email, password })
    if (error) {
        // Show a friendly UI message and log details via showError
        document.getElementById('auth-status').textContent = 'Inloggen mislukt.'
        showError(error, 'Fout bij inloggen.');
    } else {
        document.getElementById('auth-status').textContent = 'Ingelogd als ' + email
        showToast('Ingelogd als ' + email, 'success')
    }
}

async function logout() {
    await db.auth.signOut()
    document.getElementById('auth-status').textContent = 'Uitgelogd'
    showToast('Uitgelogd', 'info')
}

db.auth.getSession().then(({ data }) => {
    if (data.session) {
        document.getElementById('auth-status').textContent =
            'Ingelogd als ' + data.session.user.email
    }
})

// Functies beschikbaar maken voor onclick in HTML
window.login = login
window.logout = logout
