import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material'; 
import { getReportByCode } from '../services/reportService';

const Consult = () => {
  const [code, setCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  // --- Page title
  useEffect(() => {
    document.title = "Consulta | Clinica Sagrada Familia";
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await getReportByCode(code);
      if (response) {
        navigate(`/view/${code}`);
      }
    } catch (error) {
      setSnackbarMessage("El código introducido no es correcto.");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="consulta-page">
      <div className="consulta">
        <main className="wrapper container-xxl -noScroll">
          <h2 className="headdingB fs-1 -blue -center">
            CONSULTA EL ESTADO DE TU REPORTE
          </h2>
          <p className="subtitle">Ingresa el código para verificar su estado</p>

          <form onSubmit={handleSubmit}>
            <div className="consulta-container">
              <input
                type="text"
                id="codigo"
                name="codigo"
                className="consulta-input"
                placeholder="XXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button type="submit" className="consulta-button">
                Acceder
              </button>
            </div>
          </form>
          
          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              sx={{ 
                width: '100%',
                fontSize: '1.1rem'
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </main>
      </div> 
    </div>
  );
};

export default Consult;