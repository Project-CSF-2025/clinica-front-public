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
    let filtered = reports; // ✅ Use all reports

    if (updatedFilters.length > 0) {
      // ✅ Filter only reports matching active filters
      filtered = reports.filter(report => {
        const reportClass =
          report.status === "No leído" ? "cRedLight" :
          report.status === "En proceso" ? "cBlueLight" :
          report.status === "Resuelto" ? "cBlueDark" :
          report.status === "Eliminado" ? "cGrayDark" : "";

        return updatedFilters.includes(reportClass);
      });
    } else {
      // ✅ Default: Hide "Eliminado"
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
    </>
  )
};

export default StateFilter;
