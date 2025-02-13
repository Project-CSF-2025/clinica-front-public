import React, { useEffect, useState } from "react";

function UploadFile ({setFormData, archivo}) {
  const [fileName, setFileName] = useState(archivo ? archivo.name : "");

  useEffect(() => {
    if (archivo) {
      setFileName(archivo.name);
    }
  }, [archivo]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          archivo: {
            name: file.name,
            type: file.type,
            data: reader.result, // Base64 encode
          },
        }));
        setFileName(file.name);
      };
    }
  };

  const handleRemoveFile = () => {
    setFormData((prevData) => ({
      ...prevData,
      archivo: null,
    }));
    setFileName("");
    document.getElementById('inputGroupFile02').value = ''; // clear text input
  }

  return (
    <>
      <p className="text" style={{ color: "var(--blue)", marginTop: "initial" }}>
        Puedes subir un imágen, documento o captura que ayuden a aclarar el incidente.
      </p>

      <div className="input-group mb-3">
        <input 
          type="file"
          className="form-control"
          id="inputGroupFile02"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleRemoveFile}
          disabled={!fileName}
        >
          Remove
        </button>
      </div> 

        {/* !!! Attention */}
        {fileName && (
        <p style={{ color: "var(--darkBlue)" }}>
          Archivo seleccionado: {fileName}
        </p>
      )}
    </>
  )
}

export default UploadFile