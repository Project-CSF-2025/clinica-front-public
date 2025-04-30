import React from "react";

const AdminReportState = ({ statusHistory, reportCreatedAt }) => {
  // 並び替え（古い順）
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(a.changed_at) - new Date(b.changed_at)
  );

  const currentStatus = sortedHistory[sortedHistory.length - 1]?.new_status;

  const statusOrder = ["No leído", "En proceso", "Resuelto"];
  const currentIndex = statusOrder.indexOf(currentStatus);

  // Resueltoの最新のchanged_atを取得
  const latestResueltoEntry = [...statusHistory]
    .filter((s) => s.new_status === "Resuelto")
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))[0];

  // 特定ステータスの最新 changed_at を取得（条件つき）
  const getLatestChangedAt = (status) => {
    if (status === "No leído") {
      return reportCreatedAt
        ? new Date(reportCreatedAt).toLocaleString("es-ES")
        : "--:--";
    }

    const latestEntry = [...statusHistory]
      .filter((s) => s.new_status === status)
      .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))[0];

    const statusIndex = statusOrder.indexOf(status);
    if (!latestEntry || statusIndex > currentIndex) return "--:--";

    // ❗ Resueltoに直接ジャンプしていた場合はEn proceso非表示
    if (
      currentStatus === "Resuelto" &&
      status === "En proceso" &&
      latestResueltoEntry &&
      !statusHistory.some(
        (s) =>
          s.new_status === "En proceso" &&
          new Date(s.changed_at) < new Date(latestResueltoEntry.changed_at)
      )
    ) {
      return "--:--";
    }

    return new Date(latestEntry.changed_at).toLocaleString("es-ES");
  };

  return (
    <div className="reporte-container">
      <p className="situacion">SITUACIÓN ACTUAL</p>
      <div className="progreso">

        {/* ✅ Show "Enviado" instead of "No leído" */}
        <div className={`fase ${currentStatus === "No leído" || !currentStatus ? "-active" : ""}`}>
          <span className="estado">No leído</span>
          <span className="fecha">{getLatestChangedAt("No leído")}</span>
        </div>

        {/* ✅ Show "En Proceso" if present */}
        <div className={`fase ${currentStatus === "En proceso" ? "-active" : ""}`}>
          <span className="estado">En Proceso</span>
          <span className="fecha">{getLatestChangedAt("En proceso")}</span>
        </div>

        {/* ✅ Show "Resuelto" if present */}
        <div className={`fase ${currentStatus === "Resuelto" ? "-active" : ""}`}>
          <span className="estado">Resuelto</span>
          <span className="fecha">{getLatestChangedAt("Resuelto")}</span>
        </div>

      </div>
    </div>
  );
};

export default AdminReportState;

