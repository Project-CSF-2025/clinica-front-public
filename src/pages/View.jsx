import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import logoImg from '../assets/img/logo.svg';
import searchIcon from '../assets/img/icon-search.png';
import Modal from 'react-bootstrap/Modal';

const View = () => {
  const [searchParams] = useSearchParams();
  const [reporte, setReporte] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const codigo = searchParams.get('codigo');

    if (!codigo) {
      alert('No se ha proporcionado un código de reporte válido.');
      return;
    }

    const reportes = JSON.parse(localStorage.getItem('reportes')) || [];
    const foundReporte = reportes.find((r) => r.codigo === codigo);

    if (!foundReporte) {
      alert('Reporte no encontrado.');
      return;
    }

    setReporte(foundReporte);
  }, [searchParams]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'statusUpdate') {
        const data = JSON.parse(event.newValue);
        if (data.codigo === reporte?.codigo) {
          setReporte(prevReporte => ({
            ...prevReporte,
            estado: data.newStatus,
            fechaEnProceso: data.fechaEnProceso || prevReporte.fechaEnProceso,
            fechaResuelto: data.fechaResuelto || prevReporte.fechaResuelto
          }));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [reporte?.codigo]);

  if (!reporte) return <div>Cargando...</div>;

  return (
    <div className="pageVista">
      <header className="header custom-header">
        <div className="header__inner">
          <h1 className="header__logo max-w-64">
            <Link to="/">
              <img src={logoImg} alt="CLINICA SAGRADA FAMILIA" />
            </Link>
          </h1>
          
          <div className="container-button-consulta">
            <Link to="/consulta" className="button-vista-busqueda">
              <img src={searchIcon} alt="Icono Consultar Incidencia" className="button-icon" />
              Consultar otro código
            </Link>
          </div>
        </div>
      </header>

      <main className="actualizacion wrapper container-xxl">
        <div className="codigo">
          <h2 className="headdingB fs-1 -blue -center">Estado del reporte</h2>
          <h2 className="incidencia-title">Nº: <span>{reporte.codigo || '---'}</span></h2>
        </div>

        <div className="reporte-container">
          <p className="situacion">SITUACIÓN ACTUAL</p>
          <div className="progreso">
            <div className="fase">
              <div className="fase-estado completado">
                <span className={`estado ${!reporte.estado || reporte.estado === 'Enviado' ? '-active' : ''}`}>
                  Enviado
                </span>
                <span className="fecha">{reporte.fechaCreacion || '--:--'}</span>
              </div>
            </div>
            <div className="fase">
              <div className="fase-estado">
                <span className={`estado ${reporte.estado === 'En proceso' ? '-active' : ''}`}>
                  En Proceso
                </span>
                <span className="fecha">{reporte.fechaEnProceso || '--:--'}</span>
              </div>
            </div>
            <div className="fase">
              <div className="fase-estado">
                <span className={`estado ${reporte.estado === 'Resuelto' ? '-active' : ''}`}>
                  Resuelto
                </span>
                <span className="fecha">{reporte.fechaResuelto || '--:--'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flexBox">
          <div className="flexBox__item">
            <div className="detailBox">
              <div className="detailBox__item">
                <span className="detailBox__title">Departamento:</span>
                <span className="detailBox__text">{reporte.departamento || 'No especificado'}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Lugar:</span>
                <span className="detailBox__text">{reporte.lugar || 'Sin lugar'}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Fecha:</span>
                <span className="detailBox__text">{reporte.fechaCreacion || '--:--'}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Archivo:</span>
                {reporte.archivo && (
                  <>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setShowModal(true)}
                    >
                      Visualizar
                    </button>
                    <Modal
                      show={showModal}
                      onHide={() => setShowModal(false)}
                      className="detailBox__mdal"
                    >
                      <Modal.Body>
                        <div className="detailBox__mdal_image">
                          <img src={reporte.archivo} alt="Archivo adjunto" />
                        </div>
                      </Modal.Body>
                    </Modal>
                  </>
                )}
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Asunto:</span>
                <span className="detailBox__text">{reporte.asunto || 'Sin asunto'}</span>
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Descripción:</span>
                <div className="detailBox__textBox">{reporte.descripcion || 'Sin descripción'}</div>
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Sugerencias:</span>
                <span className="detailBox__textBox">{reporte.sugerencias || 'Sin sugerencias'}</span>
              </div>
            </div>
          </div>

          <div className="flexBox__item">
            <div className="historyBlock__wrap">
              <h2 className="headdingB fs-3 -blue -medium">Notificaciones del Administrador</h2>
              <div className="historyBlock">
                <div className="historyBlock__inner">
                  <div className="historyBlock__body">
                    {reporte.history?.map((entry, index) => (
                      <div key={index} className="historyBlock__item">
                        <div className="historyBlock__itemInner">
                          <span className="historyBlock__circle -iconMemo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                          </span>
                          <span className="historyBlock__itemHead -right">
                            <span className="-time -bold">{entry.date}</span>
                          </span>
                          <div className="historyBlock__itemBody">
                            <p className="text">{entry.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="buttonA -centerContents -mt120">
          <Link to="/" className="-iconBack">Volver</Link>
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__copyRight">
            &copy; Copyright 2024. Clínica Sagrada Família S.A. Torras i Pujalt, 1. 08022 Barcelona
          </p>
        </div>
      </footer>
    </div>
  );
};

export default View;