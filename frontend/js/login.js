// 📁 public/js/login.js
import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usuarioInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = usuarioInput.value.trim();
        const password = passwordInput.value;

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('nombre', data.nombre);
                localStorage.setItem('puesto', data.puesto);
                window.location.href = 'admin.html';
            } else {
                errorMsg.style.display = 'block';
                errorMsg.textContent = data.error || 'Error de autenticación';
            }
        } catch (err) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Error del servidor';
        }
    });
});
