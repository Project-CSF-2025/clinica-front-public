import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox";
// import axios from "axios";

function Admin() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]); // レポート一覧
  const [filteredReports, setFilteredReports] = useState([]); // フィルタリング用
  const [activeFilters, setActiveFilters] = useState([]); // 🔹 選択中のフィルターを管理
  const [searchTerm, setSearchTerm] = useState(""); // 検索用
  
  useEffect(() => {
    // !_START DUMMY ==========
    const dummyData = [
      { id: 1, report_code: "ZX000001", status: "No leído", dateTime: "25/02/2024 14:00", subject: "Fallo en equipo médico", description: "El monitor dejó de funcionar." },
      { id: 2, report_code: "ZX000002", status: "En proceso", dateTime: "24/02/2024 16:34", subject: "Accidente de paciente", description: "Paciente cayó en el pasillo." },
      { id: 3, report_code: "ZX000003", status: "Resuelto", dateTime: "23/02/2024 10:15", subject: "Problema con oxígeno", description: "Falla en el suministro de oxígeno." },
      { id: 4, report_code: "ZX000004", status: "No leído", dateTime: "25/02/2024 14:00", subject: "Fallo en equipo médico", description: "El monitor dejó de funcionar." },
      { id: 5, report_code: "ZX000005", status: "Eliminado", dateTime: "22/02/2024 09:00", subject: "Reporte eliminado", description: "Este reporte ha sido eliminado." },
    ];

    setReports(dummyData);
    setFilteredReports(dummyData);
    // !_END DUMMY ==========

    // BACK code ↓↓↓
    // ====================== 
  }, []);

  const toggleFilter = (targetClass) => {
    let updatedFilters = [...activeFilters];
  
    if (updatedFilters.includes(targetClass)) {
      // 🔹 すでに選択されている場合 → フィルターを解除
      updatedFilters = updatedFilters.filter(filter => filter !== targetClass);
    } else {
      // 🔹 新しくフィルターを追加
      updatedFilters.push(targetClass);
    }
  
    setActiveFilters(updatedFilters);
  
    // 🔹 選択されたフィルターに一致するレポートのみを表示
    if (updatedFilters.length > 0) {
      setFilteredReports(reports.filter(report =>
        updatedFilters.includes(
          report.status === "No leído" ? "cRedLight" :
          report.status === "En proceso" ? "cBlueLight" :
          report.status === "Resuelto" ? "cBlueDark" :
          report.status === "Eliminado" ? "cGrayDark" : ""
        )
      ));
    } else {
      // 🔹 フィルターがすべて解除された場合、全レポートを表示
      setFilteredReports(reports);
    }
  };

  // 🔹 ハイライト処理を適用（修正）
  const highlightText = (text, keyword) => {
    if (!keyword || keyword.trim() === "") return text;
    
    console.log("Highlighting:", keyword, "in", text); // 🔹 デバッグ用

    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? <mark key={i} className="highlight">{part}</mark> : part
    );
  };

  // 🔹 ログアウト処理
  const handleLogout = () => {
    sessionStorage.removeItem("is_authenticated"); // 認証情報削除
    sessionStorage.removeItem("user"); // ユーザー情報削除
    navigate("/admin-login"); // 🔹 ログイン画面へリダイレクト
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
                  <ul className="category__nav category__nav-class list-inline mb-0">
                    {[
                      { label: "No leído", target: "cRedLight" },
                      { label: "En proceso", target: "cBlueLight" },
                      { label: "Resuelto", target: "cBlueDark" },
                      { label: "Eliminados", target: "cGrayDark" }
                    ].map(filter => (
                      <li key={filter.target} className="list-inline-item">
                        <a
                          href="#"
                          data-target={filter.target}
                          className={`category__nav-item ${activeFilters.includes(filter.target) ? "checked" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFilter(filter.target);
                          }}
                        >
                          {filter.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  
                  <SearchBox 
                    reports={reports}
                    setFilteredReports={setFilteredReports}
                    searchTerm={searchTerm} // 🔹 `searchTerm` を渡す
                    setSearchTerm={setSearchTerm} // 🔹 `setSearchTerm` も渡す
                  />
                </div>


                {/* START ADD */}
                <div id="incidentContainer" className="js-kw know-s-wrap">
                  {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
                      <a
                        key={report.id}
                        href={`/admin-detail/${report.id}`}
                        className={`know know-s useful__wrap ${
                          report.status === "No leído" ? "cRedLight" :
                          report.status === "En proceso" ? "cBlueLight" :
                          report.status === "Resuelto" ? "cBlueDark" : ""
                        }`}
                      >
                        <p className="know__num">#{highlightText(`#${report.report_code}`, searchTerm)}</p>
                        <span className={`know__label ${
                          report.status === "No leído" ? "cRedLight" :
                          report.status === "En proceso" ? "cBlueLight" :
                          report.status === "Resuelto" ? "cBlueDark" : ""
                        }`}>
                          {highlightText(report.status, searchTerm)}
                        </span>
                        <span className="know__date">{highlightText(report.dateTime, searchTerm)}</span>
                        <h3 className="know__title">{highlightText(report.subject, searchTerm)}</h3>
                        <div className="know__info">{highlightText(report.description, searchTerm)}</div>
                      </a>
                    ))
                  ) : (
                    <p>No hay reportes disponibles</p>
                  )}
                </div>
                {/* START ADD */}
              </div>
            </div>

            <a className="btn btn-primary salir-admin" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
              <span>Cerrar Sesión</span>
            </a>
          </section>

          <aside className="notificationArea">
            <div className="notificationArea__inner">
              <ul className="notificationList">
                <li className="notificationList__item -yellow">
                  <a href="sample" className="notificationList__itemLink">
                    <span className="title">Mensaje from : XXXXXXXX</span>
                    <span className="date">10/01/2025</span>
                    <p className="description">dummy tesxt-. dummy tes...</p>
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
                </li>
                <li className="notificationList__item -blue js-click-trash">
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
                </li>
                <li className="notificationList__item -blue">
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
                </li>
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