const express = require('express');
const User = require('../models/user');
const app = express();
const router = express.Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params; 
   
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/sendRequest", async (req, res) => {
    const { userId, friendUsername } = req.body;

    try {
      console.log(userId);
      console.log(friendUsername);
  
      const user = await User.findById(userId);
      const friend = await User.findOne({ username: friendUsername });
  
      if (!user || !friend) {
        return res.status(404).send({ message: "User or friend not found" });
      }
  
      if (user.friends.includes(friend.username)) {
        return res.status(400).send({ message: "You are already friends with this user" });
      }
  
      if (user.pendingReq.includes(friend.username)) {
        return res.status(400).send({ message: "Friend request already sent" });
      }
  
      if (friend.pendingReq.includes(user.username)) {
        return res.status(400).send({ message: "You have already received a friend request from this user" });
      }
  
      friend.pendingReq.push(user.username);
      await friend.save(); 
  
      return res.status(200).send({ message: "Friend request sent" });
    } catch (err) {
      console.error("Error sending friend request:", err);
      return res.status(500).send({ message: "Failed to send friend request" });
    }
  });
  
  router.post('/acceptRequest', async (req, res) => {
    const { userId, friendUsername } = req.body;
    console.log(userId);
    console.log(friendUsername);
  
    try {
      const user = await User.findById(userId);
      const friend = await User.findOne({ username: friendUsername });
  
      if (!user || !friend) {
        return res.status(400).json({ message: "User or friend not found" });
      }
  
      if (!user.pendingReq.includes(friendUsername)) {
        return res.status(400).json({ message: "No pending friend request" });
      }
  
      user.friends.push(friendUsername);
      user.pendingReq = user.pendingReq.filter((username) => username !== friendUsername);
      await user.save();
  
      friend.friends.push(user.username); 
      await friend.save();
  
      res.status(200).json({ message: `Friend request from ${friendUsername} accepted` });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/unfriend", async (req, res) => {
    const { userId, friendUsername } = req.body;
    console.log(userId);
    console.log(friendUsername);
    try {
      const user = await User.findById(userId);
      const friend = await User.findOne({ username: friendUsername });
  
      if (!user || !friend) {
        return res.status(404).send({ message: "User or friend not found" });
      }
  
      if (!user.friends.includes(friendUsername)) {
        return res.status(400).send({ message: "You are not friends with this user" });
      }
  
      user.friends.pull(friendUsername);
      friend.friends.pull(user.username);
  
      await user.save();
      await friend.save();
  
      return res.status(200).send({ message: "Successfully unfriended" });
    } catch (err) {
      console.error("Error unfriending:", err);
      return res.status(500).send({ message: "Failed to unfriend" });
    }
  });
// In your backend (Express.js)
router.get("/users/:id", async (req, res) => {
    const { id } = req.params; 
    console.log(id);
    try {
      const currentUser = await User.findById(id);
  
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const users = await User.find({ _id: { $ne: id } });

      const nonFriends = users.filter(
        (user) =>
          !currentUser.friends.includes(user.username) &&
          !currentUser.pendingReq.includes(user.username)
      );
  
      res.status(200).json(nonFriends);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).send({ message: "Failed to fetch users" });
    }
  });
  
  

module.exports = router;
