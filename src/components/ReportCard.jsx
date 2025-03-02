import React from "react";
import { useNavigate } from "react-router-dom";

const ReportCard = ({ report, searchTerm, highlightText }) => {
  const navigate = useNavigate();

  const statusClass = report.status === "No leído" ? "cRedLight"
    : report.status === "En proceso" ? "cBlueLight"
    : report.status === "Resuelto" ? "cBlueDark"
    : report.status === "Eliminado" ? "cGrayDark"
    : "";

  return (
    <>
      <a
        key={report.report_code}
        onClick={() => navigate(`/admin/detail#${report.report_code}`, { state: report })}
        className={`know know-s useful__wrap ${statusClass}`}
      >
        <p className="know__num">#{highlightText(`#${report.report_code}`, searchTerm)}</p>
        <span className={`know__label ${
          report.status === "No leído" ? "cRedLight" :
          report.status === "En proceso" ? "cBlueLight" :
          report.status === "Resuelto" ? "cBlueDark" :
          report.status === "Eliminado" ? "cGrayDark" : ""
        }`}>
          {highlightText(report.status, searchTerm)}
        </span>
        <span className="know__date">{highlightText(report.dateTime, searchTerm)}</span>
        <h3 className="know__title">{highlightText(report.subject, searchTerm)}</h3>
        <div className="know__info">{highlightText(report.description, searchTerm)}</div>
      </a>
    </>
  )
}

export default ReportCard