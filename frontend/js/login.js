    const API_BASE_URL = 'https://gestodetareas.onrender.com/api'; // o el dominio donde tengas tu backend

    document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 👈 importante para usar cookies
        body: JSON.stringify({ usuario, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
        window.location.href = 'empleado.html'; // redirigí donde corresponda
        } else {
        document.getElementById('login-error').style.display = 'block';
        }
    } catch (error) {
        console.error('Error en login:', error);
        document.getElementById('login-error').style.display = 'block';
    }
    });
