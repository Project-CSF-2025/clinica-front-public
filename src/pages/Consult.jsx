import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Consult = () => {

  return (
    <div className="consulta-page">
      <div className="consulta">
        <main className="wrapper container-xxl -noScroll">
          <h2 className="headdingB fs-1 -blue -center">
            CONSULTA EL ESTADO DE TU REPORTE
          </h2>
          <p className="subtitle">Ingresa el código para verificar su estado</p>

          <form >
            <div className="consulta-container">
              <input
                type="text"
                id="codigo"
                name="codigo"
                className="consulta-input"
                placeholder="XXXXXX"
                
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