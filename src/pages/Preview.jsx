import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlowState from "../components/FlowState";
import { createReport } from "../services/reportService";
import { createUser } from "../services/userService"; 

function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(location.state || { files: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");

  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, files: updatedFiles });
  };

  const formatField = (value) => {
    if (value === null || value === undefined || value.toString().trim() === "") {
        return "No disponible";  // Customize message here
    }
    return value;
  };


  const handleEdit = () => {
    navigate("/form", { state: formData });
  }

  const handleSend = async () => {
    setLoading(true);
    setError(null);

    let userId = 1; // Default to anonymous user

    if (email) {
        try {
            const userResponse = await createUser({ email });
            if (userResponse?.user?.id_user) {
                userId = userResponse.user.id_user;  // Correctly assign user ID
            }
        } catch (err) {
            console.warn("⚠️ User creation failed, proceeding with anonymous user ID.");
        }
    }

    const reportData = {
        ...formData,
        id_user: userId,  // Now sending correct user ID
        location: formData.place,
    };

    console.log("🚀 Sending Report Data:", reportData);

    try {
        const response = await createReport(reportData);
        console.log("✅ API Response:", response);

        if (response?.report_code) {
            navigate("/confirm", { state: { reportCode: response.report_code } });
        } else {
            console.error("No report_code received from the server.");
            setError("Error: No report_code returned from the server.");
        }
    } catch (err) {
        console.error("❌ API Error:", err.response?.data || err.message);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (email && email.includes("@")) {
      setIsChecked(true);
      const modal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
      modal.hide();
    } else {
      alert("Por favor, ingrese un correo electrónico válido.");
    }
  };

  const handleCheckboxClick = () => {
    if (isChecked) {
      setIsChecked(false);
      setEmail("");
    } else {
      const modal = new bootstrap.Modal(document.getElementById('emailModal'));
      modal.show();
    }
  };

  return (
    <>
      <main className="wrapper container-xxl my-5">
        <FlowState />

        <div className="py-5 text-center">
          <h2 className="mb-3 text-center incident-heading margin up">Previsualización</h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-12" style={{maxWidth: "90%"}}>
            <div className="card">
              <div className="card-body py-4">
                <div className="row justify-content-center">
                  <div className="col-10">
                    {/* ===== Departamento ===== */}
                    <p className="card-text d-flex" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "200px"}}>Departamento:</strong> 
                      <span id="ticket-department" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.department)}
                      </span>
                    </p>

                    {/* ===== Professión ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "200px"}}>Professión:</strong> 
                      <span id="ticket-department" style={{color: "var(--darkBlue)", flex: "1"}}>
                      {formatField(formData.profession)}
                      </span>
                    </p>

                    {/* ===== Fecha ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "200px"}}>Fecha del incidencia:</strong> 
                      <span id="ticket-department" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.dateTime)}
                      </span>
                    </p>

                    {/* ===== Lugar ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "200px"}}>Lugar:</strong> 
                      <span id="ticket-lugar" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.place)}
                      </span>
                    </p>

                    {/* ===== Asunto ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "200px"}}>Asunto: </strong>
                      <span id="ticket-asunto" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.subject)}
                      </span>
                    </p>    

                    {/* ===== Descripción ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue", width: "200px"}}>Descripción:</strong> 
                      <span id="ticket-descripcion" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.description)}
                      </span>
                    </p>

                    {/* ===== Consecuencia si / no ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue", width: "200px"}}>¿Tiene consecuencias?:</strong> 
                      <span id="ticket-descripcion" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.isConsequent ? "Sí" : "No")}
                      </span>
                    </p>

                    {/* ===== Que consecuencia ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue", width: "200px"}}>¿Que consecuencia?:</strong> 
                      <span id="ticket-descripcion" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.consequenceType)}
                      </span>
                    </p>

                    {/* ===== Evitar si / no ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue", width: "200px"}}>¿Evitable?:</strong> 
                      <span id="ticket-descripcion" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.avoidable ? "Sí" : "No")}
                      </span>
                    </p>

                    {/* Sugerencias */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "200px"}}>Sugerencias:</strong> 
                      <span id="ticket-sugerencias" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formatField(formData.suggestions)}
                      </span>
                    </p>

                    {/* ===== File upload ===== */}
                    <div className="card-text d-flex -mt16" style={{ textAlign: "justify" }}>
                      <strong style={{ color: "var(--blue)", width: "200px" }}>Archivos:</strong>
                      <div id="ticket-files" className="styleForOverFlow" style={{ color: "var(--darkBlue)", flex: "1" }}>
                        {formData.files && formData.files.length > 0 ? (
                          <ul style={{ paddingLeft: "0px", listStyle: "none" }}>
                            {formData.files.map((file, index) => (
                              <li key={index} style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}>
                                {file.name}
                                <button
                                  className="btn btn-outline-secondary btn-sm ms-2"
                                  style={{ marginLeft: "12px" }}
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No se han subido archivos</p>
                        )}
                      </div>
                    </div>

                    {/* ===== Modal Structure ===== */}
                    <div className="text-center my-3 d-flex align-items-center justify-content-center">
                      <input
                        type="checkbox"
                        id="emailNotification"
                        className="me-2"
                        checked={isChecked}
                        onChange={handleCheckboxClick}
                      />
                      <label
                        id="emailLabel"
                        htmlFor="emailNotification"
                        className="text"
                        style={{ color: "var(--blue)", textDecoration: "none", cursor: "pointer" }}
                      >
                        Deseo recibir notificaciones por email
                      </label>
                    </div>

                    <div className="modal fade" id="emailModal" aria-labelledby="emailModalLabel" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 shadow">
                          <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-5">Ingrese su correo electrónico</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body p-5 pt-0">
                            <form onSubmit={handleEmailSubmit}>
                              <div className="form-floating mb-3">
                                <input
                                  type="email"
                                  className="form-control rounded-3"
                                  id="floatingInput"
                                  placeholder="name@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                                <label htmlFor="floatingInput">Email address</label>
                              </div>
                              <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Guardar</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-4 justify-content-center py-4">
                      <button className="buttonForm -thin" type="button" onClick={handleEdit}>Editar</button>
                      <button className="buttonForm -thin" type="button" onClick={handleSend} disabled={loading}>
                            {loading ? "Submitting..." : "Enviar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Preview