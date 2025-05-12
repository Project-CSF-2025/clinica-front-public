import React from "react";

const ViewReportState = ({ statusHistory, reportCreatedAt }) => {

  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(a.changed_at) - new Date(b.changed_at)
  );

  const currentStatus = sortedHistory[sortedHistory.length - 1]?.new_status;

  const statusOrder = ["NO LEIDO", "EN PROCESO", "RESUELTO"];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const getLatestChangedAt = (status) => {
    if (status === "NO LEIDO") {
      return reportCreatedAt
        ? new Date(reportCreatedAt).toLocaleString("es-ES", { timeZone: "UTC" })
        : "--:--";
    }
  
    const latestResueltoEntry = [...statusHistory]
      .filter((s) => s.new_status === "Resuelto")
      .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))[0];
  
    const latestEntry = [...statusHistory]
      .filter((s) => s.new_status === status)
      .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))[0];
  
    const statusIndex = statusOrder.indexOf(status);
    if (!latestEntry || statusIndex > currentIndex) return "--:--";
  
    if (
      currentStatus === "RESUELTO" &&
      status === "EN PROCESO" &&
      latestResueltoEntry &&
      !statusHistory.some(
        (s) =>
          s.new_status === "EN PROCESO" &&
          new Date(s.changed_at) < new Date(latestResueltoEntry.changed_at)
      )
    ) {
      return "--:--";
    }
  
    if (!latestEntry) return "--:--";
  
    return new Date(latestEntry.changed_at).toLocaleString("es-ES", { timeZone: "UTC" });
  };  

  return (
    <div className="reporte-container">
      <p className="situacion">SITUACIÓN ACTUAL</p>
      <div className="progreso">

        {/* Show "Enviado" instead of "No leído" */}
        <div className={`fase ${currentStatus === "NO LEIDO" ? "-active" : ""}`}>
          <span className="estado">Enviado</span>
          <span className="fecha">{getLatestChangedAt("NO LEIDO")}</span>
        </div>

        {/* Show "En Proceso" if present */}
        <div className={`fase ${currentStatus === "EN PROCESO" ? "-active" : ""}`}>
          <span className="estado">En Proceso</span>
          <span className="fecha">{getLatestChangedAt("EN PROCESO")}</span>
        </div>

        {/* Show "Resuelto" if present */}
        <div className={`fase ${currentStatus === "RESUELTO" ? "-active" : ""}`}>
          <span className="estado">Resuelto</span>
          <span className="fecha">{getLatestChangedAt("RESUELTO")}</span>
        </div>

      </div>
    </div>
  );
};

export default ViewReportState;
