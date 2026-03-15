import { db } from './connection.js'

async function login() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const { error } = await db.auth.signInWithPassword({ email, password })
    if (error) {
        document.getElementById('auth-status').textContent = 'Fout: ' + error.message
    } else {
        document.getElementById('auth-status').textContent = 'Ingelogd als ' + email
    }
}

async function logout() {
    await db.auth.signOut()
    document.getElementById('auth-status').textContent = 'Uitgelogd'
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

