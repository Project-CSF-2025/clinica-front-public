import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlowState from "../components/FlowState";

function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};

  const handleEdit = () => {
    navigate("/form", {state: formData});
  }
  const handleEnvio = () => {
    navigate("/confirm", {state: formData});
  }

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
                      <strong style={{color: "var(--blue)", width: "120px"}}>Departamento:</strong> 
                      <span id="ticket-department" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formData.departamento}
                      </span>
                    </p>

                    {/* ===== Lugar ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "120px"}}>Lugar:</strong> 
                      <span id="ticket-lugar" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formData.lugar}
                      </span>
                    </p>

                    {/* ===== Asunto ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "120px"}}>Asunto: </strong>
                      <span id="ticket-asunto" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formData.asunto}
                      </span>
                    </p>    

                    {/* ===== Descripción ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue", width: "120px"}}>Descripción:</strong> 
                      <span id="ticket-descripcion" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formData.descripción}
                      </span>
                    </p>

                    {/* Sugerencias */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "120px"}}>Sugerencias:</strong> 
                      <span id="ticket-sugerencias" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formData.sugerencias}
                      </span>
                    </p>

                    {/* ===== File upload ===== */}
                    <p className="card-text d-flex -mt16" style={{textAlign: "justify"}}>
                      <strong style={{color: "var(--blue)", width: "120px"}}>Archivo:</strong> 
                      <span id="ticket-sugerencias" className="styleForOverFlow" style={{color: "var(--darkBlue)", flex: "1"}}>
                        {formData.archivo ? formData.archivo.name : ""}
                      </span>
                    </p>

                    {/* ===== Modal Structure ===== */}
                    <div className="text-center my-3 d-flex align-items-center justify-content-center">
                      <input type="checkbox" id="emailNotification" className="me-2" />
                      <label id="emailLabel" htmlFor="emailNotification" className="text" style={{color: "var(--blue)", textDecoration: "none", cursor: "pointer"}}>
                        Deseo recibir notificaciones por email
                      </label>
                    </div>
                    
                    <div className="modal fade" id="emailModal" aria-labelledby="emailModalLabel" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 shadow"> 
                          <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-5">Ingrese su correo electrónico</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                          </div>
                          <div className="modal-body p-5 pt-0">
                            <form >
                              <div className="form-floating mb-3">
                                <input type="email" className="form-control rounded-3" id="floatingInput" placeholder="name@example.com" required />
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
                      <button className="buttonForm -thin" type="button" onClick={handleEnvio}>Enviar</button>
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
