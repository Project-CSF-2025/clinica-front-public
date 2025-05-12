import React from "react";

const ChatBlock = ({
  messages,
  newMessage,
  onSend,
  onChange,
  isDisabled,
  chatRef,
  userRole = "admin", // 'admin' or 'user' to reverse message alignment
}) => {
  return (
    <div className="chatBlock__wrap">
      <h2 className="headdingB fs-3 -blue -medium">Notificación al usuario</h2>

      <div className={`chatBlock ${isDisabled ? "disabled-click" : ""}`}>
        <div className="chatBlock__inner">
          <div className="chatBlock__body" ref={chatRef}>
            {messages?.length > 0 ? (
              messages.map((msg, index) => {
                const isCurrentUser =
                  (userRole === "admin" && msg.sender_type === "admin") ||
                  (userRole === "user" && msg.sender_type === "user");

                return (
                  <div
                    key={index}
                    className={`chatBlock__item ${
                      isCurrentUser ? "-revers" : ""
                    }`}
                  >
                    <div className="chatBlock__itemInner">
                      <span
                        className={`chatBlock__circle ${
                          msg.sender_type === "admin"
                            ? "-iconMemo"
                            : "-iconUser"
                        }`}
                      >
                        {msg.sender_type === "admin" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil"
                          >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-person-fill"
                          >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                        )}
                      </span>

                      <span className="chatBlock__itemHead -right">
                        <span className="-time -bold">
                          {new Date(msg.created_at).toLocaleString("es-ES", {
                            timeZone: "UTC",
                          })}
                        </span>
                      </span>

                      <div className="chatBlock__itemBody">
                        <p className="text">{msg.message_content}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No messages available</p>
            )}
          </div>

          <div className="chatInputWrap">
            <form className="chatInput" onSubmit={(e) => e.preventDefault()}>
              <textarea
                className="chatInput__inner"
                value={newMessage}
                onChange={onChange}
                placeholder="Escribe un mensaje..."
                disabled={isDisabled}
              ></textarea>
              <button
                type="button"
                className="buttonChat icon-send"
                onClick={onSend}
                disabled={isDisabled}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-send"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBlock;
