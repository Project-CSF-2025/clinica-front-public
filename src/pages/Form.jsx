import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlowState from "../components/FlowState";
import InputDateTime from "../components/InputDateTime"; 
import InputField from "../components/InputField"; 
import SelectField from "../components/SelectField"; 
import TextareaField from "../components/TextareaField"; 
import RadioField from "../components/RadioField"; 
import UploadFile from "../components/UploadFile"; 
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {
    departamento: "",
    professión: "",
    dateTime: "",
    lugar: "",
    asunto: "",
    descripción: "",
    isConsecuent: "",
    evitable: "",
    tipoConsecuencia: "",
    sugerent: "",
    archivo: []
  };

  const [formData, setFormData] = useState(initialData);
  const [validated, setValidated] = useState(false); 
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Option: departamento
  const departamentoOptions = [
    "Hospitalización",
    "Área de cuidados intensivos",
    "Urgencias",
    "Quirófano",
    "Reanimación",
    "CMA/UCA",
    "Consultas externas",
    "Otros"
  ];

  // Option: professión 
  const professionOptions = [
    "Facultativo",
    "Enfermeria",
    "Auxiliar",
    "Celador",
    "Paciente",
    "Otro",
  ];

  // Option: Consecuencia 
  const consequenceOptions = [
    "Precisa tratamiento",
    "Precisa ingreso",
    "Prolongación de estancia",
    "Lesión permanente",
    "Muerte del paciente"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if(name === "isConsecuent" && value === "no") {
      setFormData((prevData) => ({...prevData, tipoConsecuencia: "" }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    setIsSubmitted(true);

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      navigate("/preview", { state: formData });
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
                  options={departamentoOptions}
                  required
                />

                {/* ===== Professión ===== */}
                <SelectField 
                  label="Professión"
                  name="professión"
                  value={formData.professión}
                  onChange={handleChange}
                  options={professionOptions}
                  required
                />

                {/* ===== Fecha =====  */}
                <InputDateTime 
                  label="Día y fecha"
                  name="dateTime"
                  date={formData.dateTime ? dayjs(formData.dateTime, 'DD/MM/YYYY HH:mm') : null}
                  handleChange={(newValue) => handleChange({ 
                    target: { name: "dateTime", value: newValue ? newValue.format('DD/MM/YYYY HH:mm') : "" }
                  })}
                  required
                  isValid={!!formData.dateTime}
                  isSubmitted={isSubmitted}
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

                {/* ===== Consecuencia si / no ===== */}
                <RadioField 
                  label="¿Tiene consecuencias?"
                  name="isConsecuent"
                  value={formData.isConsecuent}
                  onChange={handleChange}
                  required
                />

                {/* ===== Que consecuencia ===== */}
                <SelectField 
                  label="¿Que consecuencia?"
                  name="tipoConsecuencia"
                  value={formData.tipoConsecuencia}
                  onChange={handleChange}
                  options={consequenceOptions}
                  disabled={formData.isConsecuent !== "si"} // No
                  required={formData.isConsecuent === "si"} // Sí 
                />

                {/* ===== Evitar si / no ===== */}
                <RadioField 
                  label="¿Evitable?"
                  name="evitable"
                  value={formData.evitable}
                  onChange={handleChange}
                  required
                />
                
                {/* ===== Suggestions ===== */}
                <TextareaField
                  label="Sugerencias"
                  name="sugerent"
                  value={formData.sugerent}
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
