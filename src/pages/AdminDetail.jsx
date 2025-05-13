import React, { useEffect, useState, useRef } from "react";
import ChatBlock from "../components/ChatBlock";
import MemoBlock from "../components/MemoBlock";
import FilePreviewModal from "../components/FilePreviewModal";
import { useParams, useLocation, Link } from "react-router-dom";
import { createAdminNote } from "../services/adminNoteService";
import { getAdminNoteByReportId } from "../services/adminNoteService";
import { updateAdminNote } from "../services/adminNoteService";
import { toggleReportFlag } from "../services/adminService";
import { updateReportStatus } from "../services/reportService";
import { getMessagesByReportId, sendMessage } from "../services/messageService"; 
import { markMessagesAsRead } from "../services/messageService";
import AdminReportState from "../components/AdminReportState";
import { getReportByCode, getStatusHistoryByReportId } from "../services/reportService";
import statusOptions from "../data/statusOptions.json";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function AdminDetail() {
  const { reportCode } = useParams(); 
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFlagged, setIsFlagged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [existingMemo, setExistingMemo] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(report?.status || "NO LEIDO");

  const [statusHistory, setStatusHistory] = useState([]);
  
  // For messages
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState("");

  const chatContainerRef = useRef(null);

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
      const paramCode = reportCode || location.state?.report_code;
      if (!paramCode) {
        setError("No report code provided");
        setLoading(false);
        return;
      }
  
      try {
        const reportDetails = await getReportByCode(paramCode);
        setReport(reportDetails);
        setIsFlagged(reportDetails?.is_flagged || false); 
  
        if (reportDetails?.id_report) {
          const messageData = await getMessagesByReportId(reportDetails.id_report);
          setMessages(Array.isArray(messageData) ? messageData : []);
        } else {
          console.error("❌ No valid report ID found for message fetch.");
        }
      } catch (err) {
        console.error("❌ Error fetching report or messages:", err);
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReportAndMessages();
  
    const handleFlagChange = () => {
      fetchReportAndMessages();
    };
  
    window.addEventListener("flagUpdated", handleFlagChange);
  
    return () => {
      window.removeEventListener("flagUpdated", handleFlagChange);
    };
  }, [reportCode, location.state]);  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  

  useEffect(() => {
    if (report?.id_report) {
      fetchMessages(report.id_report);
    }
  }, [report]);

  useEffect(() => {
    if (report?.id_report) {
      markMessagesAsRead(report.id_report)
        .then(() => {
          window.dispatchEvent(new Event("flagUpdated")); 
        })
        .catch((error) => {
          console.error("❌ Failed to mark messages as read:", error);
        });
    }
  }, [report?.id_report]);  

  const fetchMemo = async (id_report) => {
    if (!id_report) {
      console.error("❌ Error: Report ID is undefined");
      return;
    }

    try {
      const response = await getAdminNoteByReportId(id_report);

      if (response) {
        setMemoText(response.admin_message);
        setExistingMemo(response);
      } else {
        setMemoText("");
        setExistingMemo(null);
      }
    } catch (error) {
      console.error("❌ Error fetching memo:", error);
      setMemoText("");
      setExistingMemo(null);
    }
  };

  const fetchMessages = async (id_report) => {
    try {
      const data = await getMessagesByReportId(id_report);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert("⚠️ Message cannot be empty!");
      return;
    }

    if (!report || !report.id_report) {
      alert("⚠️ Error: No report ID found.");
      return;
    }

    const messagePayload = {
      id_report: report.id_report,
      sender_type: "admin", // Admin is sending the message
      message_content: newMessage,
      is_read: false
    };

    try {
      await sendMessage(messagePayload);
      // Refresh messages after sending; ensure result is an array
      const updatedMessages = await getMessagesByReportId(report.id_report);
      setMessages(Array.isArray(updatedMessages) ? updatedMessages : []);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert("⚠️ Failed to send message.");
    }
  };

  useEffect(() => {
    if (report?.id_report) {
      fetchMemo(report.id_report);
    }
  }, [report]);

  useEffect(() => {
    if (report?.status) {
      const dropdownCompatibleStatus = report.status.replace(" ", "_"); 
      setSelectedStatus(dropdownCompatibleStatus);
    }
  }, [report]);

  useEffect(() => {
    if (report?.id_report) {
      getStatusHistoryByReportId(report.id_report)
        .then((history) => {
          setStatusHistory(Array.isArray(history) ? history : []);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch status history:", err);
        });
    }
  }, [report?.id_report]); 
  
  const handleStatusChange = async (e) => {
    if (selectedStatus === "ELIMINADO") {
      console.warn("❌ Status change disabled for 'ELIMINADO'");
      return;
    }
  
    const newStatusRaw = e.target.value;
    if (!report?.report_code) {
      console.error("❌ Error: No report code found");
      return;
    }
  
    try {
      const formattedStatus = newStatusRaw.replace("_", " ");
      await updateReportStatus(report.report_code, formattedStatus);
  
      // Update local state
      setSelectedStatus(newStatusRaw);
      setReport((prev) => ({
        ...prev,
        status: formattedStatus,
      }));
  
      alert("✅ Report status updated successfully!");
  
      // Refresh history to reflect the new change
      if (report.id_report) {
        const updatedHistory = await getStatusHistoryByReportId(report.id_report);
        setStatusHistory(Array.isArray(updatedHistory) ? updatedHistory : []);
      }
  
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert("❌ Failed to update status");
    }
  };   

  const handleSoftDelete = async () => {
    if (!report?.report_code) {
      console.error("❌ Error: No report code found");
      return;
    }

    try {
      await toggleReportFlag(report.id_report, false);
      await updateReportStatus(report.report_code, "ELIMINADO");
      setSelectedStatus("ELIMINADO");
      setIsFlagged(false);
      alert("✅ Report marked as ELIMINADO!");

      // Optional: Redirect to admin page after deletion
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert("❌ Failed to delete the report.");
    }
  };

  const toggleFlag = async () => {
    if (!report || !report.id_report) {
      console.error("❌ Error: No report ID found");
      return;
    }
  
    try {
      const newFlagStatus = !isFlagged;
      await toggleReportFlag(report.id_report, newFlagStatus);
      
      // Dispatch event to refresh Admin & AdminDetail pages
      window.dispatchEvent(new Event("flagUpdated"));
      
    } catch (error) {
      console.error("❌ Error updating report flag:", error);
      alert("Failed to update flag status.");
    }
  };  

  const handleDownloadPDF = () => {
    const detailBox = document.querySelector(".detailBox"); // detailBox の取得

    window.scrollTo(0, 0); 

    html2canvas(detailBox, {
      scale: 2, 
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png"); 
        const pdf = new jsPDF("p", "mm", "a4"); 
        
        const pageWidth = 210; 
        const pageHeight = 297; // A4 の縦幅 (mm)
        const imgWidth = pageWidth - 70; // 🔥 ページ内に収めるため、余白を考慮
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // 🔥 比率を維持

        // 🔥 X 軸で中央寄せ
        const xPos = (pageWidth - imgWidth) / 2;

        // 🔥 Y 軸で中央寄せ（ページの中央に配置）
        const yPos = (pageHeight - imgHeight) / 2;
        
        pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight); // 画像を PDF に追加
        pdf.save(`reporte_${report?.report_code || "descarga"}.pdf`); // PDF を保存
      })
      .catch((error) => console.error("❌ PDF creation:", error));
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleTextChange = (e) => {
    setMemoText(e.target.value);
  };

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

  const handleSaveNote = async () => {
    if (!memoText.trim()) {
        alert("Memo cannot be empty!");
        return;
    }

    if (!report?.id_report) {
        alert("Error: No report ID found.");
        return;
    }

    const notePayload = {
        id_report: report.id_report,
        admin_message: memoText,
        is_deleted: false,
    };

    try {
      if (existingMemo?.id_note) {
          await updateAdminNote(existingMemo.id_note, notePayload);
          alert("✅ Memo updated successfully!");
      } else {
          await createAdminNote(notePayload);
          alert("✅ Memo created successfully!");
      }

      fetchMemo(report.id_report);

      setIsEditing(false);
    } catch (error) {
        console.error("❌ Error saving memo:", error);
        alert("Failed to save memo.");
    }
  };

  return (
    <>
      <main className="wrapper container-xxl">
        <h2 className="adminDetailHeadding headdingA fs-1 -blue -center -regular">
          Nº REPORTE : <span className="getCode -bold">{report.report_code || "N/A"}</span>
        </h2>

        <AdminReportState statusHistory={statusHistory} reportCreatedAt={report.created_at} />

        <div className="flexBox">
          <div className="flexBox__item">
            <div className="detailBox">
              <div className="detailBox__item">
                <span className="detailBox__title">Departamento:</span>
                <span className="detailBox__text getDepartamento">{formatField(report.department)}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Professión:</span>
                <span className="detailBox__text">{formatField(report.profession)}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Fecha y hora:</span>
                <span className="detailBox__text">{formatField(report.date_time)}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Lugar:</span>
                <span className="detailBox__text getLugar">{formatField(report.location)}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">Asunto:</span>
                <span className="detailBox__text getAsunto">{formatField(report.subject)}</span>
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Descripción:</span>
                <div className="detailBox__textBox">
                  <span className="getText">{formatField(report.description)}</span>
                </div>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Tiene consecuencias?:</span>
                  {formatField(report.is_consequent === true || report.is_consequent ? "Sí" : "No")}
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Que consecuencia?:</span>
                <span className="detailBox__text">{formatField(report.consequence_type)}</span>
              </div>
              <div className="detailBox__item">
                <span className="detailBox__title">¿Evitable?:</span>
                  {formatField(report.avoidable === true || report.avoidable === 1 ? "Sí" : "No")}
              </div>
              <div className="detailBox__item -column">
                <span className="detailBox__title">Sugerencias:</span>
                <span className="detailBox__textBox getSugerencias">{formatField(report.suggestions)}</span>
              </div>
              {/* ===== Files  ===== */}
              <div className="detailBox__item">
                <span className="detailBox__title">Archivo:</span>
                <FilePreviewModal files={report.files} />
              </div>

              <div className="buttonA -sizeS -thin">
                <a 
                  onClick={(event) => {
                    event.preventDefault();
                    handleDownloadPDF();
                  }} 
                  id="downloadPDFButton"
                  style={{ color: "#fff" }}
                >Descargar</a>
              </div>
            </div>
          </div>

          <div className="flexBox__item">
            <div className="operationUnit">
              {/* ===== Status  ===== */}
              <div className="selectWrap">
              <select
                name="status"
                className={`select ${selectedStatus === "ELIMINADO" ? "disabled-select" : ""}`}
                value={selectedStatus}
                onChange={handleStatusChange}
                disabled={selectedStatus === "ELIMINADO"}
              >
                {statusOptions
                  .filter(option => option.value !== "ELIMINADO") // block deleted status from dropdown
                  .map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              </div>
              {/* ===== Flag  ===== */}
              <ul className="iconList">
                <li>
                  <span
                    className={`iconFlag__wrp ${selectedStatus === "ELIMINADO" ? "disabled-icon" : ""}`} 
                    onClick={selectedStatus === "ELIMINADO" ? (e) => e.preventDefault() : toggleFlag}
                  >
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
                  <span
                    className={`icon-trash ${selectedStatus === "ELIMINADO" ? "disabled-icon" : ""}`}
                    data-bs-toggle={selectedStatus === "ELIMINADO" ? "" : "modal"}
                    data-bs-target={selectedStatus === "ELIMINADO" ? "" : "#modalChoice"}
                    onClick={selectedStatus === "ELIMINADO" ? (e) => e.preventDefault() : undefined}
                  >
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
                      <button 
                        type="button" 
                        id="buttonEliminar" 
                        className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"
                        onClick={handleSoftDelete} 
                      >
                        <strong>Sí, eliminar</strong>
                      </button>
                      <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0" data-bs-dismiss="modal">
                        No, cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== MEMO ========== */}
            <MemoBlock
              memoText={memoText}
              isEditing={isEditing}
              isEditable={true}
              isDisabled={report?.status === "ELIMINADO"}
              onEditToggle={toggleEdit}
              onTextChange={handleTextChange}
              onSave={handleSaveNote}
            />

            {/* ========== CHAT ========== */}
            <ChatBlock
              messages={messages}
              newMessage={newMessage}
              onSend={handleSendMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              isDisabled={report?.status === "ELIMINADO"}
              chatRef={chatContainerRef}
              userRole="admin"
            />
          </div>
        </div>

        <div className="btn btn-primary salir-adminDetail">
          <Link to="/admin" className="-iconBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            Volver
          </Link>
        </div>
      </main>
    </>
  );
}

export default AdminDetail;

