import React from "react";

const ViewReportState = ({ statusHistory, reportCreatedAt }) => {
  return (
    <div className="reporte-container">
      <p className="situacion">SITUACIÓN ACTUAL</p>
      <div className="progreso">

        {/* ✅ Show "Enviado" instead of "No leído" */}
        <div className="fase">
          <span className="estado -active">Enviado</span>
          <span className="fecha">
            {reportCreatedAt ? new Date(reportCreatedAt).toLocaleString("es-ES") : "--:--"}
          </span>
        </div>

        {/* ✅ Show "En Proceso" if present */}
        <div className={`fase ${statusHistory.some(s => s.new_status === "En proceso") ? "-active" : ""}`}>
          <span className="estado">En Proceso</span>
          <span className="fecha">
            {statusHistory.find(s => s.new_status === "En proceso")?.changed_at 
              ? new Date(statusHistory.find(s => s.new_status === "En proceso").changed_at).toLocaleString("es-ES") 
              : "--:--"}
          </span>
        </div>

        {/* ✅ Show "Resuelto" if present */}
        <div className={`fase ${statusHistory.some(s => s.new_status === "Resuelto") ? "-active" : ""}`}>
          <span className="estado">Resuelto</span>
          <span className="fecha">
            {statusHistory.find(s => s.new_status === "Resuelto")?.changed_at 
              ? new Date(statusHistory.find(s => s.new_status === "Resuelto").changed_at).toLocaleString("es-ES") 
              : "--:--"}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ViewReportState;
