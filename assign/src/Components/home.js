import React, { useState, useEffect } from "react";
import FriendList from "./home_component/Friend_list";
import ChatWindow from "./home_component/ChatWindow";
import SendRequestPanel from "./home_component/SendReqPanel";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const user = location.state?.user.user;
  // console.log(user);
  console.log(user);
  const token=location.state?.token;
  // console.log(token);
  const [friends, setFriends] = useState(user?.friends || []);
  const [pendingReq, setPendingReq] = useState(user?.pendingReq || []);
  const [suggestedFriends, setSuggestedFriends] = useState([]); // For random suggestions
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Added this line for search
  const [isLoading, setIsLoading] = useState(false);

  const fetchFriendData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/friends/${user.id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },

      });
      const data = await response.json();
      if (response.ok) {
        setFriends(data.friends);
        setPendingReq(data.pendingReq);
      } else {
        console.error("Failed to fetch friend data:", data);
      }
    } catch (err) {
      console.error("Error fetching friend data:", err);
    }
  };

  // Fetch random users and suggest friends (excluding current friends and pending requests)
  const fetchUserSuggestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/friends/users/${user.id}`, {
        method: "GET",  
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Filter out users already in friends or pending requests
        const nonFriends = data.filter(
          (user) =>
            !friends.includes(user.username) &&
            !pendingReq.includes(user.username)
        );
  
        // Randomly suggest up to 5 users
        const randomSuggestions = [];
        while (randomSuggestions.length < 5 && nonFriends.length > 0) {
          const randomIndex = Math.floor(Math.random() * nonFriends.length);
          randomSuggestions.push(nonFriends[randomIndex]);
          nonFriends.splice(randomIndex, 1); // Remove selected user to avoid duplicates
        }
  
        setSuggestedFriends(randomSuggestions);
      } else {
        console.error("Failed to fetch users:", data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  
  

  useEffect(() => {
    fetchFriendData();
    fetchUserSuggestions();
    const intervalId = setInterval(fetchFriendData, 10000); // Re-fetch friend data every 10 seconds
    const intervalId2 = setInterval(fetchUserSuggestions, 10000); // Re-fetch user suggestions every 10 seconds
    return () => {
      clearInterval(intervalId); // Cleanup on unmount
      clearInterval(intervalId2);
    };
  }, [user.id]);

  // Handle sending a friend request
  const handleSendRequest = async (friendUsername) => {
    try {
      const response = await fetch("http://localhost:5000/friends/sendRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id, friendUsername }),
      });

      if (response.ok) {
        alert(`Friend request sent to ${friendUsername}`);
        fetchFriendData();
      } else {
        alert("Failed to send request");
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };

  // Handle accepting a friend request
  const handleAcceptRequest = async (friendUsername) => {
    try {
      const response = await fetch("http://localhost:5000/friends/acceptRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}`, },
        body: JSON.stringify({ userId: user.id, friendUsername }),
      });

      if (response.ok) {
        alert(`Friend request from ${friendUsername} accepted`);
        fetchFriendData();
      } else {
        alert("Failed to accept friend request");
      }
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  // Handle rejecting a friend request
  const handleRejectRequest = async (friendUsername) => {
    try {
      const response = await fetch("http://localhost:5000/friends/rejectRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}`, },
        body: JSON.stringify({ userId: user.id, friendUsername }),
      });

      if (response.ok) {
        alert(`Friend request from ${friendUsername} rejected`);
        fetchFriendData();
      } else {
        alert("Failed to reject friend request");
      }
    } catch (err) {
      console.error("Error rejecting friend request:", err);
    }
  };

  // Handle unfriending a friend
  const handleUnfriend = async (friendUsername) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/friends/unfriend", {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}`, },
        body: JSON.stringify({ userId: user.id, friendUsername }),
      });

      if (response.ok) {
        setFriends(friends.filter((friend) => friend !== friendUsername));
        alert(`You have unfriended ${friendUsername}`);
      } else {
        alert("Failed to unfriend");
      }
    } catch (err) {
      console.error("Error unfriending:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a friend for chat
  const handleSelectUser = (friendUsername) => {
    // Find the friend object in the array
    const friend = friends.find(friend => friend.username === friendUsername);
  
    if (friend) {
      // If the friend exists, set the selected user and clear messages
      setSelectedUser({ username: friend.username, chatId: friend.chat_id
      }); 
      setMessages([]);
    } else {
      // If the username is not found in friends
      alert("You can only chat with friends.");
    }
  };
  

  // const handleSelectUser = async (friendUsername) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`http://localhost:5000/chat/${friendUsername}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (response.ok) {
  //       const messages = await response.json();
  //       console.log("Messages:", messages);
  //       setMessages(messages); // Update state with messages
  //     } else {
  //       console.error("Failed to fetch messages");
  //     }
  //   } catch (err) {
  //     console.error("Error retrieving messages:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  
  // // Handle sending a message
  // const handleSendMessage = () => {
    
  //   if (newMessage.trim()) {
  //     setMessages([...messages, { sender: "You", text: newMessage }]);
  //     setNewMessage("");
  //   }
  // };
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "0",
      backgroundColor: "#f7f9fc",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    navbar: {
      backgroundColor: "#34495e",
      padding: "10px 20px",
      color: "#ecf0f1",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    navTitle: {
      fontSize: "20px",
      fontWeight: "bold",
    },
    layout: {
      display: "flex",
      gap: "20px",
      flex: 1,
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h2 style={styles.navTitle}>Friend Manager</h2>
      </nav>
      <div style={styles.layout}>
        <FriendList
          friends={friends.map(friend => friend.username)}
          onSelectUser={handleSelectUser}
          onUnfriend={handleUnfriend}
        />
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          // newMessage={newMessage}
          // onSendMessage={handleSendMessage}
          // setNewMessage={setNewMessage}
          user={user}
          token={token}
        />
        <SendRequestPanel
          users={user?.allUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSendRequest={handleSendRequest}
          pendingRequests={pendingReq}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          suggestedFriends={suggestedFriends} // Pass the suggested random friends
        />
      </div>
    </div>
  );
};

export default Home;
