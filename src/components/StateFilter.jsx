import React from 'react';

const StateFilter = ({ activeFilters, setActiveFilters, reports, setFilteredReports }) => {
  
  const toggleFilter = (targetClass) => {
    let updatedFilters = [...activeFilters];

    if (updatedFilters.includes(targetClass)) {
      updatedFilters = updatedFilters.filter(filter => filter !== targetClass);
    } else {
      updatedFilters.push(targetClass);
    }

    setActiveFilters(updatedFilters);

    // ✅ Apply the filters based on updated active filters
    applyFilters(updatedFilters);
  };

  const applyFilters = (updatedFilters) => {
    let filtered = reports;

  if (updatedFilters.length > 0) {
    filtered = reports.filter(report => {
      // ✅ 複数のクラスを持つようにする
      let reportClasses = [];

      if (report.status === "NO LEIDO") reportClasses.push("cRedLight");
      if (report.status === "EN PROCESO") reportClasses.push("cBlueLight");
      if (report.status === "RESUELTO") reportClasses.push("cBlueDark");
      if (report.status === "ELIMINADO") reportClasses.push("cGrayDark");
      if (report.is_flagged) reportClasses.push("cYellow"); // ✅ Prioritario対象

      // ✅ いずれかのクラスがフィルターに含まれているかチェック
      return updatedFilters.some(filter => reportClasses.includes(filter));
    });
    } else {
      // ✅ Default: Hide "Eliminado"
      filtered = reports.filter(report => report.status !== "ELIMINADO");
    }

    setFilteredReports(filtered);
  };

  return (
    <>
      <ul className="category__nav category__nav-class list-inline mb-0">
        {[
          { label: "NO LEIDO", target: "cRedLight" },
          { label: "EN PROCESO", target: "cBlueLight" },
          { label: "RESUELTO", target: "cBlueDark" },
          { label: "ELIMINADO", target: "cGrayDark" },
          { label: "PRIORITARIO", target: "cYellow" }
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
    </>
  )
};

export default StateFilter;
