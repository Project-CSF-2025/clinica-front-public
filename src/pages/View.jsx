import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getReportByCode } from "../services/reportService";
import { getMessagesByReportId, sendMessage } from "../services/messageService";
import ViewReportState from "../components/ViewReportState";

function View() {
  const { reportCode } = useParams();
  const location = useLocation();

  const [report, setReport] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
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
  }, [report, reportCode]);

  useEffect(() => {
    if (!report?.id_report) return;

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessagesByReportId(report.id_report);
        setMessages(fetchedMessages);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [report]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      alert("⚠️ Cannot send empty message!");
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
      console.log("✅ Message sent!");

      const updatedMessages = await getMessagesByReportId(report.id_report);
      setMessages(updatedMessages);

      setNewMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
      alert("❌ Failed to send message.");
    }
  };

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <main className="wrapper container-xxl">
        <h2 className="adminDetailHeadding headdingA fs-1 -blue -center -regular">
          Nº REPORTE :
          <span className="getCode -bold">{report.report_code || "N/A"}</span>
        </h2>

        <ViewReportState />

        <div className="flexBox">
          <div className="flexBox__item">
            <div className="detailBox">
              <div className="detailBox__item">
                <span className="detailBox__title">Departamento:</span>
                <span className="detailBox__text getDepartamento">{report.department || "No disponible"}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Professión:</span>
                <span className="detailBox__text">{report.profession || "No disponible"}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Fecha y hora:</span>
                <span className="detailBox__text">{report.created_at || "No disponible"}</span>
              </div>
            </div>
          </div>

          <div className="flexBox__item">
            <div className="chatBlock__wrap">
              <h2 className="headdingB fs-3 -blue -medium">Notificación al usuario</h2>
              <div className="chatBlock -mt40">
                <div className="chatBlock__inner">
                  <div className="chatBlock__body">
                    {messages.length === 0 ? (
                      <p>No messages yet</p>
                    ) : (
                      messages.map((msg, index) => (
                        <div key={index} className={`chatBlock__item ${msg.sender_type === "admin" ? "-revers" : ""}`}>
                          <div className="chatBlock__itemInner">
                            <span className={`chatBlock__circle ${msg.sender_type === "admin" ? "-iconMemo" : "-iconUser"}`}></span>
                            <span className="chatBlock__itemHead -right">
                              <span className="-time -bold">{new Date(msg.created_at).toLocaleString()}</span>
                            </span>
                            <div className="chatBlock__itemBody">
                              <p className="text">{msg.message_content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="chatInputWrap">
                  <form className="chatInput" onSubmit={handleSendMessage}>
                    <textarea className="chatInput__inner" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Escribe un mensaje..." />
                    <button type="submit" className="buttonChat icon-send">Enviar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default View;
