import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/adminAuthService';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // calls your backend, stores token
      setError('');
      navigate('/admin'); // go to dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}                
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
              
              <div className="text-end mt-2">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-underline"
                  style={{ color: '#007bff', fontWeight: '500', fontSize: '0.9rem' }}
                  onClick={() => navigate("/admin/forgot-password")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

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