import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/img/logo.svg'; 

const Consult = () => {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (codigo.trim()) {
      navigate(`/vista?codigo=${codigo}`);
    } else {
      alert('Por favor, ingresa un código válido');
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
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
              <button type="submit" className="consulta-button">
                Acceder
              </button>
            </div>
          </form>
        </main>
      </div> 
    </div>
  );
};

export default Consult;