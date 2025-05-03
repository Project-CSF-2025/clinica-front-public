import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getReportByCode, getStatusHistoryByReportId } from "../services/reportService";
import { getMessagesByReportId, sendMessage } from "../services/messageService";
import ViewReportState from "../components/ViewReportState";
import { markAdminMessagesAsRead } from "../services/messageService"; 

function View() {
  const { reportCode } = useParams();
  const location = useLocation();

  const [report, setReport] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState("");

  const chatContainerRef = useRef(null);

  // Use a ref to store the report code to prevent infinite rerenders
  const reportCodeRef = useRef(reportCode || location.state?.report_code);
  
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // --- Page title
  useEffect(() => {
    if (report?.report_code) {
      document.title = `Nº ${report.report_code} | Clinica Sagrada Familia`;
    }
  }, [report?.report_code]);

  useEffect(() => {
    const fetchReportAndMessages = async () => {
      const paramCode = reportCodeRef.current;
      if (!paramCode) {
        setError("No report code provided");
        setLoading(false);
        return;
      }
  
      try {
        const reportDetails = await getReportByCode(paramCode);
        setReport(reportDetails);
  
        if (reportDetails?.id_report) {
          // ✅ Handle 404 for status history separately
          try {
            const history = await getStatusHistoryByReportId(reportDetails.id_report);
            setStatusHistory(Array.isArray(history) ? history : []);
          } catch (historyErr) {
            if (historyErr.response?.status === 404) {
              console.warn("No status history found.");
              setStatusHistory([]); 
            } else {
              throw historyErr;
            }
          }
  
          // ✅ Fetch messages if report ID exists
          const messageData = await getMessagesByReportId(reportDetails.id_report);
          setMessages(Array.isArray(messageData) ? messageData : []);
        } else {
          console.error("❌ No valid report ID found for message fetch.");
          setMessages([]);
        }
      } catch (err) {
        console.error("❌ Error fetching report or messages:", err);
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReportAndMessages();
  }, []);  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  

  useEffect(() => {
    if (report?.report_code) {
      markAdminMessagesAsRead(report.report_code)
        .then(() => console.log("✅ Admin messages marked as read"))
        .catch((err) => console.error("❌ Failed to mark admin messages as read:", err));
    }
  }, [report]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      alert("⚠️ Cannot send an empty message!");
      return;
    }
    if (!report?.id_report) {
      alert("⚠️ No valid report found!");
      return;
    }

    const messagePayload = {
      id_report: report.id_report,
      sender_type: "user",
      message_content: newMessage,
      is_read: false,
    };

    try {
      await sendMessage(messagePayload);
      console.log("✅ Message sent successfully!");

      // ✅ Refresh messages after sending
      const updatedMessages = await getMessagesByReportId(report.id_report);
      setMessages(Array.isArray(updatedMessages) ? updatedMessages : []);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert("⚠️ Failed to send message.");
    }
  };

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="error">{error}</p>;


  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="error">{error}</p>;

  const formatField = (value) => {
    if (value === null || value === undefined || value.toString().trim() === "") {
        return "No disponible"; 
    }

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

  return (
    <>
      <main className="wrapper container-xxl pageView">
        <h2 className="adminDetailHeadding headdingA fs-1 -blue -center -regular">
          Nº REPORTE :
          <span className="getCode -bold">{report.report_code || "N/A"}</span>
        </h2>

        <ViewReportState statusHistory={statusHistory} reportCreatedAt={report.created_at} />

        <div className="flexBox">
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
                <span className="detailBox__text">
                  {formatField(report.date_time)}
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
                  {formatField(report.is_consequent ? "Sí" : "No")}
                </span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Que consecuencia?:</span>
                <span className="detailBox__text">
                  {formatField(report.consequence_type)}
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
            </div>
          </div>

          {/* ========== RIGHT COLUMN (Notification / Chat) ========== */}
          <div className="flexBox__item">
          <div className="chatBlock__wrap">
            <h2 className="headdingB fs-3 -blue -medium">Notificación al usuario</h2>

            <div className={`chatBlock ${report?.status === "ELIMINADO" ? "disabled-click" : ""}`}>

              <div className="chatBlock__inner">
                <div className="chatBlock__body" ref={chatContainerRef}>
                  {/* 5. Show messages or "No messages" */}
                  {messages.length === 0 ? (
                    <p>No messages yet</p>
                  ) : (
                    messages.map((msg, index) => {
                      const isAdmin = msg.sender_type === "admin";
                      return (
                        <div
                          key={index}
                          className={`chatBlock__item ${isAdmin ? "" : "-revers"}`}
                        >
                          <div className="chatBlock__itemInner">
                            <span className={`chatBlock__circle ${isAdmin ? "-iconUser" : "-iconMemo"}`}>
                              {/* icon logic */}
                              {isAdmin ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"></path>
                                </svg>
                              )}
                            </span>
                            <span className="chatBlock__itemHead -right">
                              <span className="-time -bold">
                                {new Date(msg.created_at).toLocaleString()}
                              </span>
                            </span>
                            <div className="chatBlock__itemBody">
                              <p className="text">{msg.message_content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* 6. Chat input form */}
                <div className="chatInputWrap">
                  <form className="chatInput" onSubmit={handleSendMessage}>
                    <textarea
                      className="chatInput__inner"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                    />
                    <button type="submit" className="buttonChat icon-send">
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
        
        <div className="btn btn-primary salir-adminDetail">
          <Link to="/" className="-iconBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
          </svg>
            Salir
          </Link>
        </div>
      </main>
    </>
  );
}

export default View;
