import React from "react";

function RadioField ({label, name, value, onChange, required}) {
  return (
    <>
      <div className="col-sm-12 d-flex align-items-center mb-3">
        <label className="form-label me-2" style={{width: "200px", color: "var(--blue)"}}>
          {label} {required && <span className="-required">*</span>}
        </label>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id={`${name}-si`}
            name={name} 
            value="si"
            checked={value === "si"} 
            onChange={onChange}
            required={required} 
          />
          <label htmlFor={`${name}-si`} className="form-check-label">Sí</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id={`${name}-no`}
            name={name}
            value="no"
            checked={value === "no"}
            onChange={onChange}
            required={required} 
          />
          <label htmlFor={`${name}-no`} className="form-check-label">No</label>
        </div>

        {/* ERROR messaage */}
        {/* {required && value === null && (
          <div className="invalid-feedback">Por favor, seleccione una opción.</div>
        )} */}
      </div>
    </>
  )
}

export default RadioField