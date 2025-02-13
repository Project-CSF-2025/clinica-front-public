import React from "react";

function InputField ({label, name, value, onChange, required}) {
  return (
    <>
      <div className="col-sm-12 d-flex align-items-center mb-3">
        <label htmlFor={name} className="form-label me-2" style={{width: "200px", color: "var(--blue)"}}>
          {label} {required && <span className="-required">*</span>}
        </label>
        <div className="input-box">
          <input 
            type="text"
            className="form-control flex-grow-1 ms-3"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          />
          <div className="invalid-feedback">Por favor, ingrese {label.toLowerCase()}.</div>
        </div>
      </div>
    </>
  )
}

export default InputField
