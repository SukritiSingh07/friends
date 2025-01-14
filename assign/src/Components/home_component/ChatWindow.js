import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({ selectedUser, messages, user, token }) => {
  const [chatMessages, setChatMessages] = useState(messages || {});
  const [loading, setLoading] = useState(false);
  const chatMessagesContainerRef = useRef(null);
  const fetchMessagesInterval = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTop =
        chatMessagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const fetchMessages = async () => {
    if (!selectedUser?.chatId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/chat/chat-room/${selectedUser.chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const fetchedMessages = await response.json();
        setChatMessages(fetchedMessages);
      } else {
        const errorData = await response.json();
        console.error("Error fetching messages:", errorData.error);
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
    if (newMessage.trim() === "") return;

    try {
      const response = await fetch("http://localhost:5000/chat/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatRoomId: selectedUser.chatId,
          senderId: user._id,
          message: newMessage,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setChatMessages((prevMessages) => ({
          ...prevMessages,
          messages: [...prevMessages.messages, sentMessage],
        }));
        setNewMessage(""); // Clear input field
      } else {
        const data = await response.json();
        console.error("Failed to send message:", data.error);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const styles = {
    chatWindow: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflowY: "hidden",
      maxHeight: "600px",
      height: "100%",
    },
    heading: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "15px",
      fontSize: "22px",
      fontWeight: "600",
    },
    chatMessages: {
      flex: 1,
      overflowY: "auto",
      padding: "15px",
      marginBottom: "20px",
      borderRadius: "10px",
      maxHeight: "450px",
      backgroundColor: "#f9f9f9",
      boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)",
    },
    chatInputContainer: {
      display: "flex",
      gap: "10px",
    },
    chatInput: {
      flex: 1,
      padding: "12px",
      borderRadius: "25px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "16px",
      backgroundColor: "#f0f0f0",
    },
    button: {
      padding: "12px 15px",
      color: "#ffffff",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "16px",
      backgroundColor: "#3498db",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#2980b9",
    },
    messageContainer: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
      width: "100%", // Ensure message containers are full width
    },
    messageLeft: {
      alignSelf: "flex-start",
      backgroundColor: "#e6e6e6",
      color: "black",
      padding: "12px 15px",
      borderRadius: "25px",
      position: "relative",
      marginBottom: "5px", // Added space between bubble and time
    },
    messageRight: {
      alignSelf: "flex-end", // Ensure it aligns to the right
      backgroundColor: "#3498db",
      color: "white",
      padding: "12px 15px",
      borderRadius: "25px",
      position: "relative",
      marginBottom: "5px", // Added space between bubble and time
    },
    sender: {
      fontWeight: "bold",
      fontSize: "14px",
      color: "#3498db",
      marginBottom: "5px",
    },
    senderRight: {
      fontWeight: "bold",
      fontSize: "14px",
      color: "#fff", // For the "You" label, it should be white when on the right side
      marginBottom: "5px",
      textAlign: "right", // Align sender name on the right
    },
    time: {
      fontSize: "8px", // Very small font size for time
      color: "#aaa",
    },
    timeContainerLeft: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: "2px", // Minimal space between bubble and time
    },
    timeContainerRight: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "2px", // Minimal space between bubble and time
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
          <div style={styles.chatMessages} ref={chatMessagesContainerRef}>
            {loading ? (
              <div style={styles.loading}>Loading messages...</div>
            ) : chatMessages?.messages?.length > 0 ? (
              chatMessages.messages.map((msg, index) => {
                const isSender = msg.senderId === user.id;
                const senderName = isSender ? "You" : selectedUser.username;

                return (
                  <div key={msg._id} style={styles.messageContainer}>
                    <div
                      style={isSender ? styles.messageRight : styles.messageLeft}
                    >
                      <div
                        style={isSender ? styles.senderRight : styles.sender}
                      >
                        {senderName}
                      </div>
                      <div>{msg.text}</div>
                    </div>
                    <div
                      style={
                        isSender
                          ? styles.timeContainerRight
                          : styles.timeContainerLeft
                      }
                    >
                      <div style={styles.time}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
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
            <button
              onClick={handleSendMessage}
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
            >
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
