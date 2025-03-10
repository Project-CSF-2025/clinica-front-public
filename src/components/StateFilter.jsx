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
    applyFilters(updatedFilters);
  };

  const applyFilters = (updatedFilters) => {
    let filtered = reports;

  if (updatedFilters.length > 0) {
    filtered = reports.filter(report => {
      let reportClasses = [];

      if (report.status === "No leído") reportClasses.push("cRedLight");
      if (report.status === "En proceso") reportClasses.push("cBlueLight");
      if (report.status === "Resuelto") reportClasses.push("cBlueDark");
      if (report.status === "Eliminado") reportClasses.push("cGrayDark");
      if (report.is_flagged) reportClasses.push("cYellow");

      if (updatedFilters.length === 1 && updatedFilters.includes("cYellow")) {
        return report.is_flagged && report.status !== "Eliminado";
      }

      if (updatedFilters.includes("cYellow")) {
        return  report.is_flagged && 
                report.status !== "Eliminado" &&
                updatedFilters.some(filter => reportClasses.includes(filter) && filter !== "cYellow");
      }

      return updatedFilters.some(filter => reportClasses.includes(filter));
    });
    } else {
      filtered = reports.filter(report => report.status !== "Eliminado");
    }

    setFilteredReports(filtered);
  };

  return (
    <>
      <ul className="category__nav category__nav-class list-inline mb-0">
        {[
          { label: "No leído", target: "cRedLight" },
          { label: "En proceso", target: "cBlueLight" },
          { label: "Resuelto", target: "cBlueDark" },
          { label: "Eliminados", target: "cGrayDark" },
          { label: "Prioritario", target: "cYellow" }
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
