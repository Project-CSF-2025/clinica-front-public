import React from "react";

function SelectField ({label, name, value, onChange, required}) {

  const OPTIONS = ["Quirófano", "Urgencias", "Cardiología", "Oncología", "Neonatología", "Fisioterapia"];

  return (
    <>
      <div className="col-sm-12 d-flex align-items-center mb-3">
        <label htmlFor={name} className="form-label me-2" style={{ width: "200px", color: "var(--blue)" }}>
          {label} {required && <span className="-required">*</span>}
        </label>
        <div className="input-box">
          <select
            value={value}
            onChange={onChange}
            name={name}
            id={name}
            className="form-select flex-grow-1 ms-3"
            required={required}
            >
            <option value="">Choose...</option>
            {OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <div className="invalid-feedback">Por favor, seleccione un departamento válido. {label.toLowerCase()}</div>
        </div>
      </div>
    </>
  )
}

export default SelectField
