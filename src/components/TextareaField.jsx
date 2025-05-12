import React from "react";

function TextareaField({ label, name, value, onChange, required = false, maxLength = null }) {
  return (
    <>
      <div className="col-sm-12 d-flex flex-column flex-md-row align-items-md-center mb-3">
        <label
          htmlFor={name}
          className="form-label me-2"
          style={{ width: "200px", color: "var(--blue)" }}
        >
          {label} {required && <span className="-required">*</span>}
        </label>

        <div className="input-box" style={{ width: "100%" }}>
          <textarea
            value={value}
            name={name}
            id={name}
            className="form-control"
            rows="4"
            onChange={onChange}
            required={required}
            maxLength={maxLength || undefined}
          ></textarea>

          {/* ✅ Live character counter */}
          {maxLength && (
            <div
              style={{
                fontSize: "0.8em",
                color: "#666",
                textAlign: "right",
                marginTop: "4px",
              }}
            >
              {value.length}/{maxLength}
            </div>
          )}

          {/* ERROR message */}
          <div className="invalid-feedback">
            Por favor, ingrese una descripción. {label.toLowerCase()}
          </div>
        </div>
      </div>
    </>
  );
}

export default TextareaField;
