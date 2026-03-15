import { db } from '../database/connection.js';

export function initUserMenu() {
    function renderUserMenu() {
        const container = document.getElementById("right-contact-header");
        if (!container) return;

        if (window.isLoggedIn) {
            // Create the user menu container with dropdown
            container.innerHTML = `
                <div class="user-menu-container">
                    <i class="logout-icon fa-solid fa-user-check"></i>
                    <div id="dropdown-menu">
                        <a href="/manage-projects.html">Beheer</a>
                        <button id="logout-btn">Uitloggen</button>
                    </div>
                </div>
            `;

            // Add click event to toggle dropdown
            const userIcon = container.querySelector('.logout-icon');
            const dropdown = document.getElementById('dropdown-menu');

            if (userIcon && dropdown) {
                userIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!container.contains(e.target)) {
                        dropdown.classList.remove('show');
                    }
                });

                // Handle logout
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', async () => {
                        await db.auth.signOut();
                        window.location.href = '/';
                    });
                }
            }
        } else {
            container.innerHTML = `<a href="/login.html"><i class="login-icon fa-solid fa-user-gear"></i></a>`;
        }
    }

    window.addEventListener('auth-changed', renderUserMenu);
    window.addEventListener('DOMContentLoaded', renderUserMenu);
    renderUserMenu();
}

