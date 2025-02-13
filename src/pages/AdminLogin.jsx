import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verify if we're on the correct admin login path
    if (!location.pathname.includes('/admin/login')) {
      navigate('/admin/login');
      return;
    }

    // Initialize default users
    if (!localStorage.getItem('usuarios')) {
      const defaultUsers = [
        { username: 'admin', password: '1234' },
        { username: 'supervisor', password: 'abcd' },
      ];
      localStorage.setItem('usuarios', JSON.stringify(defaultUsers));
    }
  }, [location, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    const usuarioValido = usuarios.find(
      (user) => user.username === username && user.password === password
    );

    if (usuarioValido) {
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioValido));
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="loginPage">
      <main className="wrapper container-xxl">
        <div className="unique-login-container">
          <h2 className="unique-login-title headdingB fs-2 -blue -center">
            INICIO DE SESIÓN
          </h2>
          <p className="unique-login-subtitle -center">
            Introduce tus credenciales para acceder
          </p>

          <div className="unique-login-form-wrap">
            <form onSubmit={handleSubmit} className="unique-login-form">
              <label htmlFor="username" className="unique-login-label">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="unique-login-input"
                placeholder="ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="password" className="unique-login-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="unique-login-input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p style={{ color: 'red' }}>{error}</p>}
              
              <button type="submit" className="buttonLogin">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;