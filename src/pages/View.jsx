import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getReportByCode } from "../services/reportService";

function View() {
  // 1. Extract reportCode from the URL, plus any data from location.state
  const { reportCode } = useParams();
  const location = useLocation();

  // 2. Initialize local state:
  //    - If location.state has a report, use it immediately.
  //    - Otherwise, we’ll fetch from the API.
  const [report, setReport] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state); // If no state, we need to fetch
  const [error, setError] = useState(null);

  // 3. Fetch from the API if we have no report in state
  useEffect(() => {
    // If we already have a report from location.state, skip the fetch
    if (report) {
      setLoading(false);
      return;
    }

    if (!reportCode) {
      setError("No report code provided in URL");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const fetchedReport = await getReportByCode(reportCode);
        if (!fetchedReport) {
          // e.g., if your backend returns null/404 for not found
          setError("Report not found");
        } else {
          setReport(fetchedReport);
        }
      } catch (err) {
        console.error("❌ Error fetching report:", err);
        setError("Error loading report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportCode, report]);

  // 4. Handle loading and error states
  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="error">{error}</p>;

  const formatField = (value) => {
    if (value === null || value === undefined || value.toString().trim() === "") {
        return "No disponible"; 
    }

    // Check if value is a valid date
    const parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return value;
  };

  // 5. Render the full page (with your original notification/chat design)
  return (
    <>
      <main className="wrapper container-xxl">
        <h2 className="adminDetailHeadding headdingA fs-1 -blue -center -regular">
          Nº REPORTE :
          <span className="getCode -bold">{report.report_code || "N/A"}</span>
        </h2>

        <div className="flexBox">
          {/* ========== LEFT COLUMN (Report Details) ========== */}
          <div className="flexBox__item">
            <div className="detailBox">
              <div className="detailBox__item">
                <span className="detailBox__title">Departamento:</span>
                <span className="detailBox__text getDepartamento">
                  {formatField(report.department)}
                </span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Professión:</span>
                <span className="detailBox__text">
                  {formatField(report.profession)}
                </span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Fecha y hora:</span>
                {/* If your DB uses created_at instead of dateTime, adjust here */}
                <span className="detailBox__text">
                  {formatField(report.created_at)}
                </span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Lugar:</span>
                <span className="detailBox__text getLugar">
                  {formatField(report.location)}
                </span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Asunto:</span>
                <span className="detailBox__text getAsunto">
                  {formatField(report.subject)}
                </span>
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Descripción:</span>
                <div className="detailBox__textBox">
                  <span className="getText">
                    {formatField(report.description)}</span>
                </div>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Tiene consecuencias?:</span>
                <span className="detailBox__text">
                  {formatField(report.isConsequent ? "Sí" : "No")}
                </span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Que consecuencia?:</span>
                <span className="detailBox__text">
                  {formatField(report.consequenceType)}
                </span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Evitable?:</span>
                <span className="detailBox__text">
                  {formatField(report.avoidable ? "Sí" : "No")}
                </span>
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Sugerencias:</span>
                <span className="detailBox__textBox getSugerencias">
                  {formatField(report.suggestions)}
                </span>
              </div>

              {/* ===== Files  ===== */}
              <div className="detailBox__item">
                <span className="detailBox__title">Archivo:</span>
                {report.files && report.files.length > 0 ? (
                  report.files.map((file, index) => (
                    <React.Fragment key={index}>
                      <a
                        href="#"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target={`#fileModal${index}`}
                      >
                        Visualizar {file}
                      </a>
                      <div
                        className="modal fade detailBox__mdal"
                        id={`fileModal${index}`}
                        tabIndex="-1"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="detailBox__mdal_image">
                              <img
                                src={`/uploads/${file}`}
                                alt={file}
                                className="small-img"
                                style={{ marginTop: "20px", maxWidth: "100%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))
                ) : (
                  <span className="detailBox__text">No se han subido archivos</span>
                )}
              </div>
              <div className="buttonA -sizeS -thin">
                <a href="#" id="downloadPDFButton">
                  Descargar
                </a>
              </div>
            </div>
          </div>

          {/* ========== RIGHT COLUMN (Notification / Chat) ========== */}
          <div className="flexBox__item">
            <div className="chatBlock__wrap">
              <h2 className="headdingB fs-3 -blue -medium">
                Notificación al usuario
              </h2>
              <div className="chatBlock">
                <div className="chatBlock__inner">
                  <div className="chatBlock__body">
                    {/* <!--- Example chat items, or dynamic messages if you have them --> */}
                    <div className="chatBlock__item -revers ">
                      <div className="chatBlock__itemInner">
                        <span className="chatBlock__circle -iconMemo">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"></path>
                          </svg>
                        </span>
                        <span className="chatBlock__itemHead -right">
                          <span className="-time -bold">1/31 8:51</span>
                        </span>
                        <div className="chatBlock__itemBody">
                          <p className="text">text 1111</p>
                        </div>
                      </div>
                    </div>
                    <div className="chatBlock__item">
                      <div className="chatBlock__itemInner">
                        <span className="chatBlock__circle -iconUser">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-person-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                        </span>
                        <span className="chatBlock__itemHead -right">
                          <span className="-time -bold">1/31 8:51</span>
                        </span>
                        <div className="chatBlock__itemBody">
                          <p className="text">text 2222</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="chatInputWrap">
                    <form className="chatInput">
                      <textarea className="chatInput__inner" />
                      <button className="buttonChat icon-send">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-send"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="buttonA -centerContents -mt120">
          <Link to="/admin" className="-iconBack">
            Consultar estado
          </Link>
        </div>
      </main>
    </>
  );
}

export default View;
