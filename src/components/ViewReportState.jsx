import React from "react";

const ViewReportState = () => {
  return (
    <div className="reporte-container">
      <p className="situacion">SITUACIÓN ACTUAL</p>
      <div className="progreso">
        <div className="fase">
          <span className="estado -active">Enviado</span>
          <span className="fecha">--:--</span>
        </div>
        <div className="fase">
          <span className="estado">En Proceso</span>
          <span className="fecha">--:--</span>
        </div>
        <div className="fase">
          <span className="estado">Resuelto</span>
          <span className="fecha">--:--</span>
        </div>
      </div>
    </div>
  );
};

export default ViewReportState;


/* <div className="fase">
<span className={`estado ${!reporte.estado || reporte.estado === 'No leído' ? '-active' : ''}`}>
  Enviado
</span>
<span className="fecha">{reporte.fechaCreacion || '--:--'}</span>
</div>
<div className={`fase ${reporte.estado === 'En proceso' ? '-active' : ''}`}>
<span className="estado">En Proceso</span>
<span className="fecha">{reporte.fechaEnProceso || '--:--'}</span>
</div>
<div className={`fase ${reporte.estado === 'Resuelto' ? '-active' : ''}`}>
<span className="estado">Resuelto</span>
<span className="fecha">{reporte.fechaResuelto || '--:--'}</span>
</div> */