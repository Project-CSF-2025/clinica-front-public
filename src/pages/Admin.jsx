import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadIncidents();
    
    // Listen for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'statusUpdate') {
        const { codigo, newStatus, newClass } = JSON.parse(event.newValue);
        updateIncidentStatus(codigo, newStatus, newClass);
      } else if (event.key === 'flagUpdate') {
        const { codigo, isFlagged } = JSON.parse(event.newValue);
        updateIncidentFlag(codigo, isFlagged);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadIncidents = () => {
    const storedIncidents = JSON.parse(localStorage.getItem('reportes')) || [];
    setIncidents(storedIncidents);
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'No leído': return 'cRedLight';
      case 'En proceso': return 'cBlueLight';
      case 'Resuelto': return 'cBlueDark';
      case 'Eliminado': return 'cGrayDark';
      default: return '';
    }
  };

  const updateIncidentStatus = (codigo, newStatus, newClass) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => 
        incident.codigo === codigo 
          ? { ...incident, estado: newStatus, class: newClass }
          : incident
      )
    );
  };

  const updateIncidentFlag = (codigo, isFlagged) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => 
        incident.codigo === codigo 
          ? { ...incident, flagged: isFlagged }
          : incident
      )
    );
  };

  const searchIncidents = () => {
    const filteredIncidents = incidents.filter(incident => 
      incident.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredIncidents;
  };

  return (
    <div className="pageAdmin">
      <main className="wrapper container-xxl -noScroll">
        <h2 className="headdingA fs-1 -blue -center">BIENVENIDO</h2>

        <section className="knowWrap section pB10">
          <div className="container-fluid">
            <div className="filterList d-flex justify-content-between align-items-center mb-4">
              <ul className="category__nav category__nav-class list-inline mb-0">
                <li className="list-inline-item"><a data-target="cRedLight" href="#">No leído</a></li>
                <li className="list-inline-item"><a data-target="cBlueLight" href="#">En proceso</a></li>
                <li className="list-inline-item"><a data-target="cBlueDark" href="#">Resuelto</a></li>
                <li className="list-inline-item"><a data-target="cGrayDark" href="#">Eliminados</a></li>
                <li className="list-inline-item"><a data-target="cYellow" href="#">Prioritario</a></li>
              </ul>
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar incidentes" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div id="incidentContainer" className="js-kw" style={{ position: 'relative' }}>
              {searchIncidents().map((incident) => (
                <Link
                  key={incident.codigo}
                  to={`/admin/detail?codigo=${incident.codigo}`}
                  className={`know know-s useful__wrap ${getStatusClass(incident.estado)} ${incident.flagged ? 'cYellow' : ''}`}
                >
                  <p className="know__num">{incident.codigo}</p>
                  <span className={`know__label ${getStatusClass(incident.estado)}`}>
                    {incident.estado}
                  </span>
                  <span className="know__date">{incident.fechaCreacion}</span>
                  <h3 className="know__title">{incident.asunto}</h3>
                  <div className="know__info">{incident.descripcion}</div>
                  {incident.flagged && (
                    <span className="iconFlaged">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-flag-fill" viewBox="0 0 16 16">
                        <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                      </svg>
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;