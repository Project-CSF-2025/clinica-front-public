import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getReportByCode } from "../services/reportService";

function AdminDetail() {
  const { report_code } = useParams(); 
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportDetails = await getReportByCode(report_code || location.state?.report_code);
        if (reportDetails) {
          setReport(reportDetails);
        } else {
          setError("Report not found");
        }
      } catch (err) {
        console.error("❌ Error fetching report:", err);
        setError("Error loading report");
      } finally {
        setLoading(false);
      }
    };

    if (report_code || location.state?.report_code) {
      fetchReport();
    } else {
      setError("No report code provided");
      setLoading(false);
    }
  }, [report_code, location.state]);

  if (loading) return <p>Loading...</p>;
  if (loading) return <p>Loading report details...</p>;
  if (error) return <p className="error">{error}</p>;

  const [isFlagged, setIsFlagged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [memoText, setMemoText] = useState("");

  // クリックでトグル
  const toggleFlag = () => {
    setIsFlagged((prev) => !prev);
  };

  // クリックでトグル
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleTextChange = (e) => {
    setMemoText(e.target.value);
  };


  return (
    <>
      <main className="wrapper container-xxl">
        <h2 className="adminDetailHeadding headdingA fs-1 -blue -center -regular">Nº REPORTE :  <span className="getCode -bold">{report.report_code || "N/A"}</span></h2>

        <div className="flexBox">
          <div className="flexBox__item">
            <div className="detailBox">
              <div className="detailBox__item">
                <span className="detailBox__title">Departamento:</span>
                <span className="detailBox__text getDepartamento">{report.department || "N/A"}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Professión:</span>
                <span className="detailBox__text">{report.profession || "N/A"}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Fecha y hora:</span>
                <span className="detailBox__text">{report.dateTime || "N/A"}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Lugar:</span>
                <span className="detailBox__text getLugar">{report.place || "N/A"}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Asunto:</span>
                <span className="detailBox__text getAsunto">{report.subject || "N/A"}</span>
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Descripción:</span>
                <div className="detailBox__textBox"><span className="getText">{report.description || "N/A"}</span></div>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Tiene consecuencias?:</span>
                <span className="detailBox__text">{report.isConsequent || "N/A"}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Que consecuencia?:</span>
                <span className="detailBox__text">{report.consequenceType || ""}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Evitable?:</span>
                <span className="detailBox__text">{report.avoidable || "N/A"}</span>
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Sugerencias:</span>
                <span className="detailBox__textBox getSugerencias">{report.suggestion || ""}</span>
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
                      <div className="modal fade detailBox__mdal" id={`fileModal${index}`} tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="detailBox__mdal_image">
                              <img src={`/uploads/${file}`} alt={file} className="small-img" style={{ marginTop: "20px", maxWidth: "100%" }} />
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
              <div className="buttonA -sizeS -thin"><a href="#" id="downloadPDFButton">Descargar</a></div>
            </div>
          </div>

          
          <div className="flexBox__item">
            <div className="operationUnit">
              {/* ===== Status  ===== */}
              <div className="selectWrap">
                <select 
                  name="situation"
                  className="select"
                >
                  <option value="1">No leído</option>
                  <option value="2">En proceso</option>
                  <option value="3">Resuelto</option>
                </select>
              </div>
              {/* ===== Flag  ===== */}
              <ul className="iconList">
                <li>
                  <span className="iconFlag__wrp" onClick={toggleFlag}>
                    <span className={`iconFlag ${isFlagged ? "" : "-show"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-flag" viewBox="0 0 16 16">
                        <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z"/>
                      </svg>
                    </span>
                    <span className={`iconFlaged ${isFlagged ? "-show" : ""}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-flag-fill" viewBox="0 0 16 16">
                        <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                      </svg>
                    </span>
                  </span>
                </li>
                {/* ===== Bin  ===== */}
                <li>
                  <span className="icon-trash" data-bs-toggle="modal" data-bs-target="#modalChoice">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </span>
                </li>
              </ul>
              {/* Delete Modal */}
              <div className="modal fade" id="modalChoice" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content rounded-3 shadow">
                    <div className="modal-body p-4 text-center">
                      <h5 className="mb-0">¿Deseas eliminar este reporte?</h5>
                    </div>
                    <div className="modal-footer flex-nowrap p-0">
                      <button type="button" id="buttonEliminar" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"><strong>Sí, eliminar</strong></button>
                      <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0" data-bs-dismiss="modal">No, cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== MEMO ========== */}
            <div className="memoBlock__wrap">
              <h2 className="headdingB fs-3 -blue -medium">Memo</h2>
              <div className={`memoBlock ${isEditing ? "-active" : ""}`}>
                {!isEditing ? (
                  <div className="memoBlock__static">{memoText}</div>
                ) : (
                  <div className="memoBlock__edit">
                    <textarea
                      id="textEdit"
                      cols="30"
                      rows="10"
                      value={memoText}
                      onChange={handleTextChange}
                    ></textarea>
                  </div>
                )}
                <button className="memoBlock__btn" onClick={toggleEdit}>
                  {isEditing ? (
                    <span className="iconCheck">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                      </svg>
                    </span>
                  ) : (
                    <span className="iconEdit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                      </svg>
                    </span>
                  )}
                </button>
                {/* <div className="memoBlock__static">text text</div>
                <div className="memoBlock__edit">
                  <textarea name="" id="textEdit" cols="30" rows="10"></textarea>
                </div>
                <div className="memoBlock__btn">
                  <span className="iconEdit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                  </span>
                  <span className="iconCheck">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                    </svg>
                  </span>
                </div> */}
              </div>
            </div>

            {/* ========== MEMO ========== */}
            <div className="chatBlock__wrap">
              <h2 className="headdingB fs-3 -blue -medium">Notificación al usuario</h2>
              <div className="chatBlock">
                <div className="chatBlock__inner">
                  <div className="chatBlock__body">

                    {/* ========== CHAT ========== */}
                    <div className="chatBlock__item -revers ">
                      <div className="chatBlock__itemInner">
                        <span className="chatBlock__circle -iconMemo">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
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
                    {/* <!--- chat ---> */}

                  </div>
                  <div className="chatInputWrap">
                    <form className="chatInput">
                      <textarea className="chatInput__inner"></textarea>
                      <button className="buttonChat icon-send">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
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
  )
}

export default AdminDetail