import React from "react";

function SearchBox ({ reports, setFilteredReports, searchTerm, setSearchTerm }) {
  // 🔹 検索処理
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchTerm(searchText);

    if (!searchText) {
      setFilteredReports(reports); // 入力が空なら全レポートを表示
    } else {
      setFilteredReports(
        reports.filter(report => {
          const incidentText = `
            ${report.report_code}
            ${report.status}
            ${report.dateTime}
            ${report.subject}
            ${report.description}
          `.toLowerCase();
          return incidentText.includes(searchText);
        })
      );
    }
  };

  return (
    <>
      {/* <div className="input-group" style={{maxWidth: "300px"}}>
        <input type="text" className="form-control" placeholder="Buscar incidentes" id="searchInput" />
        <button className="btn btn-primary" type="button">Buscar</button>
      </div> */}
      {/* 🔹 検索バー */}
      <div className="input-group" style={{maxWidth: "300px"}}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar incidentes"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn btn-primary" type="button">Buscar</button>
      </div>
    </>
  )
}

export default SearchBox