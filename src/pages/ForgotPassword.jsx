import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/adminAuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- Page title
  useEffect(() => {
    document.title = "Recuperar Contraseña | Clinica Sagrada Familia";
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setMessage("✅ Revisa tu correo para restablecer tu contraseña.");
      setError("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "No se pudo enviar el correo.");
    }
  };

  return (
    <div className="loginPage">
      <main className="wrapper container-xxl">
        <div className="unique-login-container">
          <h2 className="unique-login-title headdingB fs-2 -blue -center">
            Recuperar Contraseña
          </h2>
          <p className="unique-login-subtitle -center">
            Ingresa tu correo electrónico para recibir un enlace de recuperación.
          </p>

          <form onSubmit={handleSubmit} className="unique-login-form">
            <label htmlFor="email" className="unique-login-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="unique-login-input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {message && <p className="text-success mt-3">{message}</p>}
            {error && <p className="text-danger mt-3">{error}</p>}

            <button type="submit" className="buttonLogin">
              Enviar enlace
            </button>

            <button
              type="button"
              className="btn btn-link mt-3"
              onClick={() => navigate("/admin-login")}
            >
              ← Volver al inicio de sesión
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
