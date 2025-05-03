import React from "react";
import { useNavigate } from "react-router-dom";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const ReportCard = ({ report, searchTerm, highlightText }) => {
  const navigate = useNavigate();
  console.log("Report Data in ReportCard:", report);

  const statusClass =
    report.status === "NO LEIDO"
      ? "cRedLight"
      : report.status === "EN PROCESO"
      ? "cBlueLight"
      : report.status === "RESUELTO"
      ? "cBlueDark"
      : report.status === "ELIMINADO"
      ? "cGrayDark"
      : "";

  return (
    <>
      <a
        key={report.report_code}
        onClick={() =>
          report.report_code
            ? navigate(`/admin/detail/${report.report_code}`, { state: report })
            : console.error("Report code is undefined")
        }
        className={`know know-s useful__wrap ${statusClass} ${report.is_flagged ? "cYellow" : ""}`}
      >
       {/* Report Code + Unread Icon */}
      <div className="know__numWrap">
        <p className="know__num">
          {highlightText(`${report.report_code}` || "", searchTerm)}
        </p>
          {report.unread_messages > 0 && (
            <span className="msgIconBadge">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
              </svg>
              <span>{report.unread_messages}</span>
            </span>
          )}
        </div>

        <span className="know__date">
          {highlightText(formatDateTime(report.created_at), searchTerm)}
        </span>
        <span className={`know__label ${statusClass}`}>
          {highlightText(report.status || "", searchTerm)}
        </span>

        {/* Subject */}
        <h3 className="know__title">
          {highlightText(report.subject || "", searchTerm)}
        </h3>

        <div className="know__info">
          {highlightText(report.description || "", searchTerm)}
        </div>

        {/* Flag Icon (Appears Only If Flagged) */}
        <span className={`iconFlag ${report.is_flagged ? "iconFlaged" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-flag-fill"
            viewBox="0 0 16 16"
          >
            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
          </svg>
        </span>
      </a>
    </>
  );
};

export default ReportCard;
