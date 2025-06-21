const API_BASE_URL = 'https://gestodetareas.onrender.com'; // ✅ sin /api

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // ✅ permite enviar cookies
            body: JSON.stringify({ usuario, password })
        });

        let data;
        try {
            data = await res.json();
        } catch (err) {
            const text = await res.text();
            console.error('Respuesta inesperada:', text);
            document.getElementById('login-error').style.display = 'block';
            return;
        }

        if (res.ok && data.success) {
            window.location.href = 'empleado.html'; // ✅ redirigí donde quieras
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    } catch (error) {
        console.error('Error en login:', error);
        document.getElementById('login-error').style.display = 'block';
    }
});
