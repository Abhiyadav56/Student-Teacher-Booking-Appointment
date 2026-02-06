import { app } from './app.js';

window.app = app;

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        app.login();
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        app.registerStudent();
    });
}
