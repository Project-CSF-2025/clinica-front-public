import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const location = useLocation();

  console.log("VITE_ADMIN_USERNAME:", import.meta.env.VITE_ADMIN_USERNAME);
  console.log("VITE_ADMIN_PASSWORD:", import.meta.env.VITE_ADMIN_PASSWORD);
    
  useEffect(() => {
    // If you are already logged in, you will be redirected to the admin page
    if (sessionStorage.getItem('is_authenticated') === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 環境変数から管理者情報を取得（必ず設定されていることを確認）
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("環境変数が設定されていません。");
      setError("サーバーエラーが発生しました。");
      return;
    }

    // 入力値と環境変数の値を比較
    if (username === adminUsername && password === adminPassword) {
      sessionStorage.setItem('is_authenticated', 'true');
      sessionStorage.setItem('user', JSON.stringify({ username }));

      setError('');
      navigate('/admin'); // 管理ページへリダイレクト
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