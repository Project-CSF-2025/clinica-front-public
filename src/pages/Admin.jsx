import React, { useState, useEffect } from "react";
import AdminMemoList from "../components/AdminMemoList";
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
  
  // --- Page title
  useEffect(() => {
    document.title = "Admin | Clinica Sagrada Familia";
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiRequest("GET", "/reports");
  
        if (Array.isArray(data)) {
          setReports(data);
          setFilteredReports(
            data
              .filter(report => report.status !== "ELIMINADO")
              .sort((a, b) => (b.unread_messages || 0) - (a.unread_messages || 0)) // 🔝 Unread first
          );          
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
  
    // Re-fetch reports when a flag is updated
    const handleFlagChange = () => {
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
            setAdminNotes(notes); // ✅ Now updates state
        } catch (error) {
            console.error("❌ Error fetching admin notes:", error);
        }
    };
    fetchAllNotes();
  }, []);

  const handleSoftDelete = async (noteId) => {
    try {
      await softDeleteAdminNote(noteId);
  
      // Re-fetch updated notes after deletion
      const updatedNotes = await getAllAdminNotes();
      setAdminNotes(updatedNotes.filter(note => note.is_deleted === false));
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

  const formatDateTime = (value) => {
    const date = new Date(value);
    return date.toLocaleString("es-ES", {
      timeZone: "UTC", 
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
                  
                  <div className="filterList__right">
                  <button className="btnDashboard btn btn-outline-secondary" onClick={() => navigate('/admin/dashboard')}>
                    <span class="icon-graph">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
                        <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z"/>
                      </svg>
                    </span> 
                    Panel de Control
                  </button>
                  
                  {/* ===== Search box =====  */}
                  <SearchBox 
                    reports={reports}
                    setFilteredReports={setFilteredReports}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeFilters={activeFilters}
                  />
                  </div>
                </div>

                {/* ===== Report card ===== */}
                <div id="incidentContainer" className="js-kw know-s-wrap">
                  {filteredReports.length > 0 ? (
                    [...filteredReports]
                      .sort((a, b) => {
                        // 🔥 Always sort by the unified activity field
                        const timeA = new Date(a.last_activity_at).getTime();
                        const timeB = new Date(b.last_activity_at).getTime();
                        return timeB - timeA;
                      })
                      .map((report, index) =>
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
              <AdminMemoList 
                adminNotes={adminNotes}
                reports={reports}
                handleSoftDelete={handleSoftDelete}
              />
            </div>
          </aside>
        </main>
      </div>
    </>
  )
}

export default Admin