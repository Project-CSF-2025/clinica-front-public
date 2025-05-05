import React, { useEffect, useState } from "react";
import axios from "axios";

function UploadFile({ setFormData, files }) {
  const [fileList, setFileList] = useState(files || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (files) {
      setFileList(files);
    }
  }, [files]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    const uploadPromises = selectedFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);

      return axios
        .post("/api/upload", formData, {
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
                original_name: response.data.original_name  
              });              
            };
          });
        })
        .catch((error) => {
          console.error(`❌ Upload failed for ${file.name}`, error.response?.data || error.message);
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
    setFormData((prevData) => {
      const updated = [...prevData.files];
      updated.splice(index, 1);
      return { ...prevData, files: updated };
    });

    setFileList((prevList) => {
      const updated = [...prevList];
      updated.splice(index, 1);
      return updated;
    });
  };

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
          multiple
          disabled={uploading}
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
                Remove
              </button>
            </p>
          ))}
        </div>
      )}
    </>
  );
}

export default UploadFile;
