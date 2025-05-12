import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getReportByCode, getStatusHistoryByReportId } from "../services/reportService";
import { getMessagesByReportId, sendMessage } from "../services/messageService";
import ViewReportState from "../components/ViewReportState";
import { markAdminMessagesAsRead } from "../services/messageService"; 
import FilePreviewModal from "../components/FilePreviewModal";
import ChatBlock from "../components/ChatBlock";

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

  const reportCodeRef = useRef(reportCode || location.state?.report_code);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

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

              <div className="detailBox__item">
                <span className="detailBox__title">Archivo:</span>
                <FilePreviewModal files={report.files} />
              </div>
            </div>
          </div>

          <div className="flexBox__item">
            <ChatBlock
              messages={messages}
              newMessage={newMessage}
              onSend={handleSendMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              isDisabled={false}
              chatRef={chatContainerRef}
              userRole="user"
            />
          </div>
        </div>

        <div className="btn btn-primary salir-adminDetail">
          <Link to="/" className="-iconBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
            </svg>
            Salir
          </Link>
        </div>
      </main>
    </>
  );
}

export default View;
