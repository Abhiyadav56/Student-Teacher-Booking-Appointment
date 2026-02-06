import { app } from './app.js';

window.app = app;

window.addEventListener('DOMContentLoaded', () => {
    app.initDashboard();
});
