import React from "react";

function TextareaField ({label, name, value, onChange, required=false}) {
  return (
    <>
      <div className="col-sm-12 d-flex align-items-center mb-3">
        <label htmlFor={name} className="form-label me-2" style={{width: "200px", color: "var(--blue)"}}>
          {label} {required && <span className="-required">*</span>}
        </label>
        <div className="input-box">
          <textarea
            value={value}
            name={name}
            id={name}
            className="form-control" 
            rows="4"
            onChange={onChange}
            required={required}
          >
          </textarea>
          <div className="invalid-feedback">Por favor, ingrese una descripción. {label.toLowerCase()}</div>
        </div>
      </div>
    </>
  )
}

export default TextareaField
