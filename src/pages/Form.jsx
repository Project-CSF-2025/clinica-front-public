import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlowState from "../components/FlowState";
import InputField from "../components/InputField"; 
import SelectField from "../components/SelectField"; 
import TextareaField from "../components/TextareaField"; 
import UploadFile from "../components/UploadFile"; 

function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {
    departamento: "",
    lugar: "",
    asunto: "",
    descripción: "",
    sugerencias: "",
    archivo: null
  };

  const [formData, setFormData] = useState(initialData);
  const [validated, setValidated] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if(form.checkValidity()) {
      navigate("/preview", { state: formData });
    } else {
      setValidated(true);
    }
  };

  return (
    <>
      <main className="wrapper container-xxl">
        <FlowState />

        <div className="row justify-content-center my-5">
          <div className="col-lg-6">
            <form className={`needs-validation ${validated ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* ===== Departamento =====  */}
                <SelectField 
                  label="Departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  required
                />
                
                {/* ===== Lugar ===== */}
                <InputField
                  label="Lugar"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  required
                />

                {/* ===== Asunto ===== */}
                <InputField
                  label="Asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                />

                {/* ===== Description ===== */}
                <TextareaField
                  label="Descripción"
                  name="descripción"
                  value={formData.descripción}
                  onChange={handleChange}
                  required
                />
                
                {/* ===== Suggestions ===== */}
                <TextareaField
                  label="Sugerencias"
                  name="sugerencias"
                  value={formData.sugerencias}
                  onChange={handleChange}
                />            
                
                {/* ===== File upload ===== */}
                <hr className="my-4" />
                <UploadFile 
                  setFormData={setFormData}
                  archivo={formData.archivo}
                />
                <hr className="my-4" />


                {/* ===== Submit button ===== */}
                <div style={{display: "flex", justifyContent: "center"}}>
                  <button className="buttonForm" type="submit">Previsualizar Informe</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export default Form
