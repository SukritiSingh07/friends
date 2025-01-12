import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({ selectedUser,  messages, userId }) => {
  const [chatMessages, setChatMessages] = useState(messages);
  const [loading, setLoading] = useState(false);
  const chatMessagesContainerRef = useRef(null);
  const fetchMessagesInterval = useRef(null);
  const [newMessage, setNewMessage] = useState([]);

  // useEffect(() => {
  //   if (chatMessagesContainerRef.current) {
  //     chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
  //   }
  // }, [chatMessages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/chat/chat-room/${selectedUser.chatRoomId}/messages`);
      const data = await response.json();
      if (response.ok) {
        setChatMessages(data.messages); 
      } else {
        console.error("Error fetching messages:", data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();

      fetchMessagesInterval.current = setInterval(fetchMessages, 5000);
    }

    return () => {
      if (fetchMessagesInterval.current) {
        clearInterval(fetchMessagesInterval.current);
      }
    };
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const response = await fetch("http://localhost:5000/chat/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatRoomId: selectedUser.chatRoomId,
          senderId: userId,
          message: newMessage,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setChatMessages((prevMessages) => [...prevMessages, sentMessage]);
        setNewMessage(""); 
      } else {
        const data = await response.json();
        console.error("Failed to send message:", data);
      }
    }
  };

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
      maxHeight: "400px", 
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
    loading: {
      textAlign: "center",
      color: "#888",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.chatWindow}>
      <h3 style={styles.heading}>Chat</h3>
      {selectedUser ? (
        <>
          <div style={styles.chatHeader}>Chat with {selectedUser.name}</div>
          <div
            style={styles.chatMessages}
            ref={chatMessagesContainerRef}
          >
            {loading ? (
              <div style={styles.loading}>Loading messages...</div>
            ) : chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div key={index} style={styles.message}>
                  <strong>{msg.sender.username}: </strong>
                  {msg.message}
                </div>
              ))
            ) : (
              <div style={styles.placeholder}>No messages yet...</div>
            )}
          </div>
          <div style={styles.chatInputContainer}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={styles.chatInput}
            />
            <button onClick={handleSendMessage} style={styles.button}>
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
