import React from "react";

function FilePreviewModal({ files }) {
  if (!files || files.length === 0) {
    return <span className="detailBox__text">No se han subido archivos</span>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
      {files.map((file, index) => {
        const filename =
          file.server_filename ||
          (file.file_path && file.file_path.split("/").pop()) ||
          "";
        const originalName = file.original_name || file.name || filename;
        const extension = filename.split(".").pop().toLowerCase();

        const isImage =
          file.attachment_type === "IMAGE" ||
          ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
        const isDownloadable = [
          "pdf",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "ppt",
          "pptx",
        ].includes(extension);

        const fileUrl = `http://localhost:5000/api/attachments/download/${filename}`;

        if (isImage) {
          return (
            <React.Fragment key={index}>
              <button
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                data-bs-target={`#modalFile${index}`}
              >
                {originalName}
              </button>

              {/* Modal for image preview */}
              <div
                className="modal fade"
                id={`modalFile${index}`}
                tabIndex="-1"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{originalName}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body text-center">
                      <img
                        src={fileUrl}
                        alt={originalName}
                        className="img-fluid"
                        style={{ maxHeight: "80vh" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        }

        if (isDownloadable) {
          return (
            <a
              key={index}
              href={fileUrl}
              className="btn btn-outline-secondary"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              {originalName}
            </a>
          );
        }

        return (
          <span className="text-muted" key={index}>
            Archivo no compatible: {originalName}
          </span>
        );
      })}
    </div>
  );
}

export default FilePreviewModal;
