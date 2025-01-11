import React from "react";

const FriendList = ({ friends, onSelectUser, onUnfriend }) => {
  const styles = {
    panel: {
      flex: 1,
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
    list: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #f0f0f0",
    },
    button: {
      padding: "8px 12px",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#e74c3c",
    },
    friendName: {
      cursor: "pointer",
      color: "#34495e",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>Friend List</h3>
      {friends && friends.length > 0 ? (
        <ul style={styles.list}>
          {friends.map((friendUsername, index) => (
            <li key={index} style={styles.listItem}>
              <span
                onClick={() => onSelectUser(friendUsername)}
                style={styles.friendName}
              >
                {friendUsername}
              </span>
              <button
                onClick={() => onUnfriend(friendUsername)}
                style={styles.button}
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>
          No friends to display.
        </p>
      )}
    </div>
  );
};

export default FriendList;
