import React, { useEffect, useState } from "react";

function UploadFile ({setFormData, files}) {
  const [fileList, setFileList] = useState(files || []);

  useEffect(() => {
    if (files) {
      setFileList(files);
    }
  }, [files]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.readAsDataURL(file);
          reader.onload = () => {
            resolve({
              name: file.name,
              type: file.type,
              data: reader.result, // Base64 encode
            });
          };
        });
      });

      Promise.all(newFiles).then((fileData) => {
        setFormData((prevData) => ({
          ...prevData,
          files: [...prevData.files, ...fileData],
        }));
        setFileList((prevList) => [...prevList, ...fileData]);
      });
    }
  };

  const handleRemoveFile = (index) => {
    setFormData((prevData) => {
      const newFiles = [...prevData.files];
      newFiles.splice(index, 1);
      return { ...prevData, files: newFiles };
    });

    setFileList((prevList) => {
      const newList = [...prevList];
      newList.splice(index, 1);
      return newList;
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
        />
      </div> 

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
  )
}

export default UploadFile