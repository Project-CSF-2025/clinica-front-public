import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; 
import StateFilter from "../components/StateFilter";
import SearchBox from "../components/SearchBox";
import ReportCard from "../components/ReportCard";
import { apiRequest } from "../services/apiService"; 
import { getAllAdminNotes, softDeleteAdminNote } from "../services/adminNoteService";


function Admin() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]); 
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminNotes, setAdminNotes] = useState([]); 
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiRequest("GET", "/reports");
        console.log("✅ Fetched Reports:", data);
  
        if (Array.isArray(data)) {
          setReports(data);
          setFilteredReports(data.filter(report => report.status !== "Eliminado"));
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  
    // ✅ Re-fetch reports when a flag is updated
    const handleFlagChange = () => {
      console.log("🔄 Flag status changed, refreshing reports...");
      fetchReports();
    };
  
    window.addEventListener("flagUpdated", handleFlagChange);
  
    return () => {
      window.removeEventListener("flagUpdated", handleFlagChange);
    };
  }, []); 

  useEffect(() => {
    const fetchAllNotes = async () => {
        try {
            const notes = await getAllAdminNotes();
            console.log("✅ Fetched Admin Notes:", notes);
            setAdminNotes(notes); // ✅ Now updates state
        } catch (error) {
            console.error("❌ Error fetching admin notes:", error);
        }
    };
    fetchAllNotes();
  }, []);

  const handleSoftDelete = async (noteId) => {
    try {
        console.log("🗑️ Attempting to soft delete note:", noteId);
        await softDeleteAdminNote(noteId);

        // ✅ Update UI by removing the deleted note from the list
        setAdminNotes((prevNotes) => prevNotes.filter(note => note.id_note !== noteId));

        console.log("✅ Soft deleted note:", noteId);
    } catch (error) {
        console.error("❌ Error deleting note:", error);
    }
  };


  /* ===== Searched text highlight =====  */
  const highlightText = (text, keyword) => {
    if (!text) return "";
    if (!keyword || keyword.trim() === "") return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? <mark key={i} className="highlight">{part}</mark> : part
    );
  };

  return (
    <>
      <div className="pageAdmin">
        <main className="pageAdmin wrapper container-xxl -noScroll">
          <section className="section sectionAdminMain">
            <h2 className="headdingA fs-1 -blue -center">BIENVENIDO</h2>
            <div className="knowWrap pB10">
              <div className="container-fluid">
                <div className="filterList d-flex justify-content-between align-items-center mb-5">
                  {/* ===== Filter list =====  */}
                  <StateFilter
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    reports={reports}
                    setFilteredReports={setFilteredReports}
                  />
                  
                  {/* ===== Search box =====  */}
                  <SearchBox 
                    reports={reports}
                    setFilteredReports={setFilteredReports}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeFilters={activeFilters}
                  />
                </div>

                {/* ===== Report card ===== */}
                <div id="incidentContainer" className="js-kw know-s-wrap">
                  {filteredReports.length > 0 ? (
                    filteredReports.slice().reverse().map((report, index) => 
                      report ? ( 
                        <ReportCard
                          key={report._id || index} 
                          report={report}
                          searchTerm={searchTerm}
                          highlightText={highlightText}
                        />
                      ) : null
                    )
                  ) : (
                    <p>No hay reportes disponibles</p>
                  )}
                </div>
              </div>
            </div>

            {/* ===== Logout button ===== */}
            <LogoutButton/>
          </section>

          <aside className="notificationArea">
            <div className="notificationArea__inner">
              <ul className="notificationList">
              {[...adminNotes]
              .sort((a, b) => new Date(b.last_update_at) - new Date(a.last_update_at)) // 最新の更新順にソート
              .map((note) => {
                // Get report_code corresponding to note.id_report
                const report = reports.find(report => report.id_report === note.id_report);

                return(
                  <li key={note.id_note} className="notificationList__item -blue">
                    <a 
                      onClick={(e) => {
                        e.preventDefault(); // デフォルトのリンク動作を防ぐ
                        if (report && report.report_code) {
                          navigate(`/admin/detail/${report.report_code}`, { state: report });
                        } else {
                          console.error("Report code is undefined for id_report:", note.id_report);
                        }
                      }} 
                      href="#" 
                      className="notificationList__itemLink"
                    >
                      <span className="title">{note.admin_message}</span>
                      <span className="date">{note.last_update_at}</span>
                    </a>
                    <span className="notificationList__itemSub">
                        <div className="icon-trash" onClick={() => handleSoftDelete(note.id_note)}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.875 6.875C7.04076 6.875 7.19973 6.94085 7.31694 7.05806C7.43415 7.17527 7.5 7.33424 7.5 7.5V15C7.5 15.1658 7.43415 15.3247 7.31694 15.4419C7.19973 15.5592 7.04076 15.625 6.875 15.625C6.70924 15.625 6.55027 15.5592 6.43306 15.4419C6.31585 15.3247 6.25 15.1658 6.25 15V7.5C6.25 7.33424 6.31585 7.17527 6.43306 7.05806C6.55027 6.94085 6.70924 6.875 6.875 6.875ZM10 6.875C10.1658 6.875 10.3247 6.94085 10.4419 7.05806C10.5592 7.17527 10.625 7.33424 10.625 7.5V15C10.625 15.1658 10.5592 15.3247 10.4419 15.4419C10.3247 15.5592 10.1658 15.625 10 15.625C9.83424 15.625 9.67527 15.5592 9.55806 15.4419C9.44085 15.3247 9.375 15.1658 9.375 15V7.5C9.375 7.33424 9.44085 7.17527 9.55806 7.05806C9.67527 6.94085 9.83424 6.875 10 6.875ZM13.75 7.5C13.75 7.33424 13.6842 7.17527 13.5669 7.05806C13.4497 6.94085 13.2908 6.875 13.125 6.875C12.9592 6.875 12.8003 6.94085 12.6831 7.05806C12.5658 7.17527 12.5 7.33424 12.5 7.5V15C12.5 15.1658 12.5658 15.3247 12.6831 15.4419C12.8003 15.5592 12.9592 15.625 13.125 15.625C13.2908 15.625 13.4497 15.5592 13.5669 15.4419C13.6842 15.3247 13.75 15.1658 13.75 15V7.5Z" fill="black"/>
                            <path d="M18.125 3.75C18.125 4.08152 17.9933 4.39946 17.7589 4.63388C17.5245 4.8683 17.2065 5 16.875 5H16.25V16.25C16.25 16.913 15.9866 17.5489 15.5178 18.0178C15.0489 18.4866 14.413 18.75 13.75 18.75H6.25C5.58696 18.75 4.95107 18.4866 4.48223 18.0178C4.01339 17.5489 3.75 16.913 3.75 16.25V5H3.125C2.79348 5 2.47554 4.8683 2.24112 4.63388C2.0067 4.39946 1.875 4.08152 1.875 3.75V2.5C1.875 2.16848 2.0067 1.85054 2.24112 1.61612C2.47554 1.3817 2.79348 1.25 3.125 1.25H7.5C7.5 0.918479 7.6317 0.600537 7.86612 0.366117C8.10054 0.131696 8.41848 0 8.75 0L11.25 0C11.5815 0 11.8995 0.131696 12.1339 0.366117C12.3683 0.600537 12.5 0.918479 12.5 1.25H16.875C17.2065 1.25 17.5245 1.3817 17.7589 1.61612C17.9933 1.85054 18.125 2.16848 18.125 2.5V3.75ZM5.1475 5L5 5.07375V16.25C5 16.5815 5.1317 16.8995 5.36612 17.1339C5.60054 17.3683 5.91848 17.5 6.25 17.5H13.75C14.0815 17.5 14.3995 17.3683 14.6339 17.1339C14.8683 16.8995 15 16.5815 15 16.25V5.07375L14.8525 5H5.1475ZM3.125 3.75H16.875V2.5H3.125V3.75Z" fill="black"/>
                        </svg>
                        </div>
                    </span>
                  </li>
                );
              })}
                {/* <li className="notificationList__item -yellow">
                  <a href="sample" className="notificationList__itemLink">
                    <span className="title">Tu memo</span>
                    <span className="date">10/01/2025</span>
                    <p className="description">dummy tesxt-. dummy tes... dummy tesxt-. dummy tes...</p>
                  </a>
                  <span className="notificationList__itemSub">
                    <div className="icon-trash">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.875 6.875C7.04076 6.875 7.19973 6.94085 7.31694 7.05806C7.43415 7.17527 7.5 7.33424 7.5 7.5V15C7.5 15.1658 7.43415 15.3247 7.31694 15.4419C7.19973 15.5592 7.04076 15.625 6.875 15.625C6.70924 15.625 6.55027 15.5592 6.43306 15.4419C6.31585 15.3247 6.25 15.1658 6.25 15V7.5C6.25 7.33424 6.31585 7.17527 6.43306 7.05806C6.55027 6.94085 6.70924 6.875 6.875 6.875ZM10 6.875C10.1658 6.875 10.3247 6.94085 10.4419 7.05806C10.5592 7.17527 10.625 7.33424 10.625 7.5V15C10.625 15.1658 10.5592 15.3247 10.4419 15.4419C10.3247 15.5592 10.1658 15.625 10 15.625C9.83424 15.625 9.67527 15.5592 9.55806 15.4419C9.44085 15.3247 9.375 15.1658 9.375 15V7.5C9.375 7.33424 9.44085 7.17527 9.55806 7.05806C9.67527 6.94085 9.83424 6.875 10 6.875ZM13.75 7.5C13.75 7.33424 13.6842 7.17527 13.5669 7.05806C13.4497 6.94085 13.2908 6.875 13.125 6.875C12.9592 6.875 12.8003 6.94085 12.6831 7.05806C12.5658 7.17527 12.5 7.33424 12.5 7.5V15C12.5 15.1658 12.5658 15.3247 12.6831 15.4419C12.8003 15.5592 12.9592 15.625 13.125 15.625C13.2908 15.625 13.4497 15.5592 13.5669 15.4419C13.6842 15.3247 13.75 15.1658 13.75 15V7.5Z" fill="black"/>
                        <path d="M18.125 3.75C18.125 4.08152 17.9933 4.39946 17.7589 4.63388C17.5245 4.8683 17.2065 5 16.875 5H16.25V16.25C16.25 16.913 15.9866 17.5489 15.5178 18.0178C15.0489 18.4866 14.413 18.75 13.75 18.75H6.25C5.58696 18.75 4.95107 18.4866 4.48223 18.0178C4.01339 17.5489 3.75 16.913 3.75 16.25V5H3.125C2.79348 5 2.47554 4.8683 2.24112 4.63388C2.0067 4.39946 1.875 4.08152 1.875 3.75V2.5C1.875 2.16848 2.0067 1.85054 2.24112 1.61612C2.47554 1.3817 2.79348 1.25 3.125 1.25H7.5C7.5 0.918479 7.6317 0.600537 7.86612 0.366117C8.10054 0.131696 8.41848 0 8.75 0L11.25 0C11.5815 0 11.8995 0.131696 12.1339 0.366117C12.3683 0.600537 12.5 0.918479 12.5 1.25H16.875C17.2065 1.25 17.5245 1.3817 17.7589 1.61612C17.9933 1.85054 18.125 2.16848 18.125 2.5V3.75ZM5.1475 5L5 5.07375V16.25C5 16.5815 5.1317 16.8995 5.36612 17.1339C5.60054 17.3683 5.91848 17.5 6.25 17.5H13.75C14.0815 17.5 14.3995 17.3683 14.6339 17.1339C14.8683 16.8995 15 16.5815 15 16.25V5.07375L14.8525 5H5.1475ZM3.125 3.75H16.875V2.5H3.125V3.75Z" fill="black"/>
                      </svg>
                    </div>
                  </span>
                  <div className="notificationModal">
                    <p className="notificationModal__title">¿Seguro que quieres borrarlo?</p>
                    <div className="notificationModal__buttonWrap">
                      <span id="btnNoEliminar" className="notificationModal__button -bgWhite">No</span>
                      <span id="btnEliminar" className="notificationModal__button -bgBlue">Sí</span>
                    </div>
                  </div>
                </li> */}
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </>
  )
}

export default Admin




// loginの方法とclose session
// eliminadoの色、トップ非表示、