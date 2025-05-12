import React from "react";

const MemoBlock = ({
  memoText,
  isEditing,
  isEditable = true,
  isDisabled,
  onEditToggle,
  onTextChange,
  onSave
}) => {
  return (
    <div className="memoBlock__wrap">
      <h2 className="headdingB fs-3 -blue -medium">Recordatorio</h2>

      <div className={`memoBlock ${isEditing ? "-active" : ""} ${isDisabled ? "disabled-click" : ""}`}>
        {!isEditing ? (
          <div className="memoBlock__static">
            {memoText ? memoText : "No memo available"}
          </div>
        ) : (
          <div className="memoBlock__edit">
            <textarea
              id="textEdit"
              cols="30"
              rows="10"
              value={memoText}
              onChange={onTextChange}
              disabled={isDisabled}
            />
          </div>
        )}

        {/* Show edit/save button only if editable */}
        {isEditable && (
          <button
            className="memoBlock__btn"
            onClick={isEditing ? onSave : onEditToggle}
            disabled={isDisabled}
          >
            {isEditing ? (
              <span className="iconCheck">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check">
                  <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                </svg>
              </span>
            ) : (
              <span className="iconEdit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                </svg>
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MemoBlock;
