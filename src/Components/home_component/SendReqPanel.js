import React, { useState } from "react";

const SendReqPanel = ({ 
  users, 
  searchQuery, 
  setSearchQuery, 
  onSendRequest, 
  onAcceptRequest, 
  onRejectRequest, 
  pendingRequests, 
  suggestedFriends 
}) => {
  const [searchText, setSearchText] = useState(searchQuery);

  const styles = {
    panel: {
      flex: 1,
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "15px",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    heading: {
      textAlign: "center",
      color: "#2c3e50",
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "20px",
    },
    searchInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px",
      borderBottom: "1px solid #ddd",
      paddingBottom: "10px",
    },
    searchInput: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.3s",
    },
    searchInputFocused: {
      borderColor: "#3498db",
    },
    button: {
      padding: "10px 15px",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      backgroundColor: "#2ecc71",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#27ae60",
    },
    pendingRequestContainer: {
      backgroundColor: "#f4f6f9",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    pendingHeading: {
      textAlign: "center",
      color: "#34495e",
      marginBottom: "12px",
      fontSize: "20px",
      fontWeight: "500",
    },
    pendingList: {
      listStyleType: "none",
      padding: "0",
      marginTop: "10px",
    },
    pendingListItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #ddd",
      fontSize: "16px",
      fontWeight: "500",
    },
    pendingActions: {
      display: "flex",
      gap: "8px",  // Space between the buttons
    },
    suggestedFriendsContainer: {
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "10px",
      marginTop: "30px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    suggestedFriendsHeading: {
      textAlign: "center",
      color: "#34495e",
      marginBottom: "12px",
      fontSize: "20px",
      fontWeight: "500",
    },
    suggestedList: {
      listStyleType: "none",
      padding: "0",
      marginTop: "10px",
    },
    suggestedListItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #ddd",
      fontSize: "16px",
      fontWeight: "500",
    },
    suggestedButton: {
      padding: "8px 12px",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#3498db",
      transition: "background-color 0.3s",
    },
    suggestedButtonHover: {
      backgroundColor: "#2980b9",
    },
  };

  // Handle sending the request with the search text (user input)
  const handleSendRequest = () => {
    if (searchText.trim()) {
      onSendRequest(searchText);  // Pass search text to onSendRequest function
    }
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>Send Request</h3>

      {/* Search Input and Send Request Button */}
      <div style={styles.searchInputContainer}>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setSearchQuery(e.target.value);
          }}
          style={styles.searchInput}
          onFocus={(e) => e.target.style.borderColor = styles.searchInputFocused.borderColor}
          onBlur={(e) => e.target.style.borderColor = "#ccc"}
        />
        <button
          onClick={handleSendRequest}
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          +
        </button>
      </div>
      {pendingRequests && pendingRequests.length > 0 && (
        <div style={styles.pendingRequestContainer}>
          <h4 style={styles.pendingHeading}>Pending Requests</h4>
          <ul style={styles.pendingList}>
            {pendingRequests.map((username, index) => (
              <li key={index} style={styles.pendingListItem}>
                <span>{username}</span>
                <div style={styles.pendingActions}>
                  <button
                    style={styles.button}
                    onClick={() => onRejectRequest(username)}
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                  >
                    Reject
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => onAcceptRequest(username)}
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                  >
                    Accept
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Suggested Friends Section */}
      {suggestedFriends && suggestedFriends.length > 0 && (
        <div style={styles.suggestedFriendsContainer}>
          <h4 style={styles.suggestedFriendsHeading}>Suggested Friends</h4>
          <ul style={styles.suggestedList}>
            {suggestedFriends.map((friend) => (
              <li key={friend._id} style={styles.suggestedListItem}>
                <span>{friend.username}</span>
                <button
                  onClick={() => onSendRequest(friend.username)}
                  style={styles.suggestedButton}
                  onMouseOver={(e) => e.target.style.backgroundColor = styles.suggestedButtonHover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = styles.suggestedButton.backgroundColor}
                >
                  Send Request
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pending Requests Section */}
      
    </div>
  );
};

export default SendReqPanel;
