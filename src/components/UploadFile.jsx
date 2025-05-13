import React, { useEffect, useState } from "react";
import axios from "axios";

function UploadFile({ setFormData, files }) {
  const [fileList, setFileList] = useState(files || []);
  const [uploading, setUploading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (files) {
      setFileList(files);
    }
  }, [files]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const currentCount = fileList.length;
    const totalSelected = currentCount + selectedFiles.length;

    if (totalSelected > 2) {
      alert("⚠️ Solo puedes subir un máximo de 2 archivos (imagen o PDF).");
      return;
    }

    const existingFilenames = new Set(fileList.map((f) => f.name));

    const filteredFiles = selectedFiles.filter((file) => {
      if (existingFilenames.has(file.name)) {
        alert(`⚠️ El archivo "${file.name}" ya fue subido.`);
        return false;
      }
      return true;
    });

    if (filteredFiles.length === 0) return;

    setUploading(true);

    const uploadPromises = filteredFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);

      return axios
        .post(`${API_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const attachmentType = response.data.attachment_type?.toUpperCase() || "DOCUMENT";

          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                data: reader.result,
                file_path: response.data.file_path,
                attachment_type: attachmentType,
                server_filename: response.data.filename,
                original_name: response.data.original_name,
              });
            };
          });
        })
        .catch((error) => {
          console.error(`❌ Falló la subida de ${file.name}`, error.response?.data || error.message);
          return null;
        });
    });

    Promise.all(uploadPromises).then((uploadedFiles) => {
      const validFiles = uploadedFiles.filter((f) => f !== null);

      setFormData((prevData) => ({
        ...prevData,
        files: [...(prevData.files || []), ...validFiles],
      }));

      setFileList((prevList) => [...prevList, ...validFiles]);
      setUploading(false);
    });
  };

  const handleRemoveFile = (index) => {
    const updatedList = [...fileList];
    updatedList.splice(index, 1);

    setFormData((prevData) => ({
      ...prevData,
      files: updatedList,
    }));

    setFileList(updatedList);
  };

  return (
    <>
      <p className="text" style={{ color: "var(--blue)", marginTop: "initial" }}>
        Puedes subir hasta <strong>2 archivos</strong> (imágenes o PDF) que ayuden a aclarar el incidente.
      </p>

      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          id="inputGroupFile02"
          onChange={handleFileChange}
          multiple
          accept=".pdf, image/*"
          disabled={uploading || fileList.length >= 2}
        />
      </div>

      {uploading && (
        <p style={{ color: "var(--blue)" }}>
          Subiendo archivos...
        </p>
      )}

      {fileList.length > 0 && (
        <div style={{ marginTop: "0px" }}>
          {fileList.map((file, index) => (
            <p key={index} style={{ color: "var(--darkBlue)", marginTop: "12px" }}>
              Archivo seleccionado: {file.name}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                style={{ marginLeft: "12px" }}
                onClick={() => handleRemoveFile(index)}
              >
                Eliminar
              </button>
            </p>
          ))}
        </div>
      )}
    </>
  );
}

export default UploadFile;
