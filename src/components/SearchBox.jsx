import React from "react";

function SearchBox ({ reports, setFilteredReports, searchTerm, setSearchTerm, activeFilters }) {
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchTerm(searchText);

    let filtered = reports.filter(report => {
      if (!report) return false;
      const incidentText = `
        ${report.report_code || ""}
        ${report.status || ""}
        ${report.dateTime || ""}
        ${report.subject || ""}
        ${report.description || ""}
      `.toLowerCase();
      return incidentText.includes(searchText);
    });

    // 🔹 検索をクリアした場合、"Eliminado" を非表示
    if (!searchText && !activeFilters.includes("cGrayDark")) {
      filtered = filtered.filter(report => report.status !== "Eliminado");
    }

    setFilteredReports(filtered);
  };
  
  return (
    <>
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

// when i put letters in search box, Should the bin card be displayed? OK