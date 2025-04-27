import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FlowState from "../components/FlowState";
import InputDateTime from "../components/InputDateTime"; 
import InputField from "../components/InputField"; 
import SelectField from "../components/SelectField"; 
import TextareaField from "../components/TextareaField"; 
import RadioField from "../components/RadioField"; 
import UploadFile from "../components/UploadFile"; 

dayjs.extend(customParseFormat);

function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {
    department: "",
    profession: "",
    dateTime: "",
    place: "",
    subject: "",
    description: "",
    isConsequent: "",
    avoidable: "",
    consequenceType: "",
    suggestions: "",
    files: []
  };

  const [formData, setFormData] = useState(initialData);
  const [validated, setValidated] = useState(false); 
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ Check for existing submission
  React.useEffect(() => {
    const isSubmitted = localStorage.getItem("reportAlreadySubmitted");
    if (isSubmitted) {
      navigate("/confirm", { replace: true });
    }
  }, [navigate]);
  
  // Option: departamento
  const departmentOptions = [
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
  
    if(name === "isConsequent" && value === "no") {
      setFormData((prevData) => ({...prevData, consequenceType: "" }));
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
      const cleanedData = {
        ...formData,
        isConsequent: formData.isConsequent === "si" ? "YES" : "NO",
        avoidable: formData.avoidable === "si" ? "YES" : "NO"
      };
      navigate("/preview", { state: cleanedData });
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
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={departmentOptions}
                  required
                />

                {/* ===== Professión ===== */}
                <SelectField 
                  label="Professión"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  options={professionOptions}
                  required
                />

                {/* ===== Fecha =====  */}
                <InputDateTime 
                  label="Fecha y Hora: Incidente"
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
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  required
                />

                {/* ===== Asunto ===== */}
                <InputField
                  label="Asunto"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

                {/* ===== Description ===== */}
                <TextareaField
                  label="Descripción"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

                {/* ===== Consecuencia si / no ===== */}
                <RadioField 
                  label="¿Tiene consecuencias?"
                  name="isConsequent"
                  value={formData.isConsequent}
                  onChange={handleChange}
                  required
                />

                {/* ===== Que consecuencia ===== */}
                <SelectField 
                  label="¿Que consecuencia?"
                  name="consequenceType"
                  value={formData.consequenceType}
                  onChange={handleChange}
                  options={consequenceOptions}
                  disabled={formData.isConsequent !== "si"} // No
                  required={formData.isConsequent === "si"} // Sí 
                />

                {/* ===== Evitar si / no ===== */}
                <RadioField 
                  label="¿Evitable?"
                  name="avoidable"
                  value={formData.avoidable}
                  onChange={handleChange}
                  required
                />
                
                {/* ===== Suggestions ===== */}
                <TextareaField
                  label="Sugerencias"
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleChange}
                />            
                
                {/* ===== File upload ===== */}
                <hr className="my-4" />
                <UploadFile 
                  setFormData={setFormData}
                  files={formData.files}
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
