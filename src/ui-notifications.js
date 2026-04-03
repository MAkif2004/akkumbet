// Lightweight notification helper used by the frontend to avoid showing raw backend errors to users.
// Provides showToast(message, type, duration) and showError(error, userMessage).

export function showToast(message, type = 'info', duration = 4000) {
  // Ensure container exists
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    // Basic positioning and stacking styles (kept minimal to not depend on CSS files)
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.minWidth = '200px';
  toast.style.maxWidth = '360px';
  toast.style.padding = '0.6rem 0.8rem';
  toast.style.borderRadius = '6px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  toast.style.color = '#fff';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-6px)';
  toast.style.transition = 'opacity 200ms ease, transform 200ms ease';

  // Type styles
  if (type === 'success') {
    toast.style.background = '#2d8a4d';
  } else if (type === 'danger' || type === 'error') {
    toast.style.background = '#c0392b';
  } else if (type === 'warning') {
    toast.style.background = '#f39c12';
    toast.style.color = '#000';
  } else {
    toast.style.background = '#34495e';
  }

  container.appendChild(toast);

  // Trigger show
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Auto remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

export function showError(error, userMessage = 'Er is iets misgegaan. Probeer het opnieuw.') {
  // Log full error details for debugging (devs only)
  console.error(userMessage, error);
  // Show a generic, non-sensitive message to the user
  showToast(userMessage, 'danger', 6000);
}

