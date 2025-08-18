// Système d'authentification simple pour la phase de développement
const CORRECT_PASSWORD = 'trrsss2025';
const AUTH_KEY = 'trrsss_auth';

export function isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_KEY) === 'true';
}

export function authenticate(password) {
    if (password === CORRECT_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        return true;
    }
    return false;
}

export function logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
}

export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/auth';
    }
}
