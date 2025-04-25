import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/adminAuthService"; // 🔄 Use shared service

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }
  
    try {
      await resetPassword(token, newPassword);
  
      // ✅ Clear localStorage/sessionStorage to force logout
      localStorage.removeItem('adminToken'); // use your actual token key name
      sessionStorage.removeItem('adminToken');
  
      setMessage("✅ Contraseña actualizada correctamente.");
      setError("");
  
      // ✅ After 3 seconds, redirect to login page
      setTimeout(() => navigate("/admin-login"), 3000);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "No se pudo restablecer la contraseña");
    }
  };  

  return (
    <div className="loginPage">
      <main className="wrapper container-xxl">
        <div className="unique-login-container">
          <h2 className="unique-login-title headdingB fs-2 -blue -center">
            Restablecer Contraseña
          </h2>
          <p className="unique-login-subtitle -center">
            Ingresa tu nueva contraseña
          </p>

          <form onSubmit={handleSubmit} className="unique-login-form">
            <label htmlFor="newPassword" className="unique-login-label">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              className="unique-login-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword" className="unique-login-label">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="unique-login-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {message && <p className="text-success mt-3">{message}</p>}
            {error && <p className="text-danger mt-3">{error}</p>}

            <button
              type="button"
              className="btn btn-link mt-3"
              onClick={() => navigate("/admin-login")}
            >
              ← Volver al inicio de sesión
            </button>

            <button type="submit" className="buttonLogin mt-3">
              Guardar Contraseña
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
