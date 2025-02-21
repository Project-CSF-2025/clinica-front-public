import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import iconCheck from "../assets/img/icon_check.png";
import FlowState from "../components/FlowState";

function Confirm() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const reportCode = location.state?.reportCode || "XXXXXXX"; 

    const handleReturnToTop = () => {
        navigate("/");
    };

    return (
        <>
            <main className="wrapper container-xxl -noScroll">
                <FlowState />
                
                <div className="position-relative p-4 text-center text-muted bg-body border border-dashed rounded-5" style={{ marginTop: "58px" }}>
                    <span className="bi mb-3">
                        <img src={iconCheck} className="small-img" style={{ marginTop: "20px" }} />
                    </span>
                    
                    <h2 className="headdingB fs-3 -blue px-5 mt-3 mb-4" style={{ marginBottom: "40px" }}>
                        ¡TU REPORTE HA SIDO ENVIADO CON ÉXITO!
                    </h2>
                    
                    <div className="border border-primary rounded-3 p-4 my-4" style={{ maxWidth: "400px", margin: "auto" }}>
                        <h3 className="fs-5">Número de ticket</h3>
                        <h2 id="codigoTicket" className="headdingB fs-1 -blue mb-0">{reportCode}</h2>
                    </div>
                    
                    <p className="col-lg-6 mx-auto mb-4" style={{ marginTop: "20px", color: "red" }}>
                        ¡Guarde este número para consultar el estado de su reporte!
                    </p>
                    
                    <button className="buttonForm" onClick={handleReturnToTop}>
                        Volver al inicio
                    </button>
                </div>
            </main>
        </>
    );
}

export default Confirm;
