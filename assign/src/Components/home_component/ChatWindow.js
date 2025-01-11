import React from "react";

const ChatWindow = ({ selectedUser, messages, newMessage, onSendMessage, setNewMessage }) => {
  const styles = {
    chatWindow: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflowY: "auto",
    },
    heading: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "10px",
    },
    chatHeader: {
      fontWeight: "bold",
      marginBottom: "10px",
    },
    chatMessages: {
      flex: 1,
      overflowY: "auto",
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
    },
    chatInputContainer: {
      display: "flex",
      gap: "10px",
    },
    chatInput: {
      flex: 1,
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 15px",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#3498db",
    },
    message: {
      marginBottom: "5px",
    },
    placeholder: {
      textAlign: "center",
      marginTop: "20px",
      color: "#888",
    },
  };

  return (
    <div style={styles.chatWindow}>
      <h3 style={styles.heading}>Chat</h3>
      {selectedUser ? (
        <>
          <div style={styles.chatHeader}>Chat with {selectedUser.name}</div>
          <div style={styles.chatMessages}>
            {messages.map((msg, index) => (
              <div key={index} style={styles.message}>
                <strong>{msg.sender}: </strong>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.chatInputContainer}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={styles.chatInput}
            />
            <button onClick={onSendMessage} style={styles.button}>
              Send
            </button>
          </div>
        </>
      ) : (
        <div style={styles.placeholder}>Select a user to start chatting</div>
      )}
    </div>
  );
};

export default ChatWindow;
