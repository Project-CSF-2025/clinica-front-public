import React from "react";
import { useLocation } from "react-router-dom";

function FlowState () {
  const location = useLocation();

  return (
    <>
      <div className="flowListWrap">
        <ul className="flowList">
          <li className={location.pathname === "/form" ? "-flowActive" : ""}>Entrada de Datos</li>
          <li className={location.pathname === "/preview" ? "-flowActive" : ""}>Revisión y Verificación</li>
          <li className={location.pathname === "/confirm" ? "-flowActive" : ""}>Envío y Confirmación</li>
        </ul>
      </div>
    </>
  )
}

export default FlowState
