const express = require('express');
const User = require('../models/user');
const ChatRoom = require('../models/ChatRoom');
const app = express();
const router = express.Router();

// Helper function to fetch users excluding current user's friends and pending requests
async function getNonFriends(currentUser) {
    try {
        const users = await User.find({ _id: { $ne: currentUser._id } }); // Exclude current user
        return users.filter(
            (user) =>
                !currentUser.friends.some(friend => friend.equals(user._id)) &&
                !currentUser.pendingReq.includes(user.username)
        );
    } catch (error) {
        throw new Error('Error fetching users');
    }
}

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
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

    try {
        const user = await User.findById(userId);
        const friend = await User.findOne({ username: friendUsername });

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        if (!user.pendingReq.includes(friendUsername)) {
            return res.status(400).json({ message: "No pending friend request" });
        }

        user.friends.push({
            username: friend.username,
            chat_id: null 
        });

        user.pendingReq = user.pendingReq.filter((username) => username !== friendUsername);
        await user.save();

        friend.friends.push({
            username: user.username,
            chat_id: null 
        });
        await friend.save();

        const chatRoom = new ChatRoom({
            users: [user._id, friend._id],
            messages: [],
            createdAt: new Date()
        });
        await chatRoom.save()
            .then(() => console.log("Chat room created successfully"))
            .catch(err => console.error("Error creating chat room:", err));
        
        const userFriend = user.friends.find(f => f.username === friend.username);

        const friendUser = friend.friends.find(f => f.username === user.username);

        if (userFriend) {
            userFriend.chat_id = chatRoom._id;
        }
        if (friendUser) {
            friendUser.chat_id = chatRoom._id;
        }

        await user.save();
        await friend.save();

        res.status(200).json({ message: `Friend request from ${friendUsername} accepted` });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/unfriend", async (req, res) => {
    const { userId, friendUsername } = req.body;

    try {
        const user = await User.findById(userId);
        const friend = await User.findOne({ username: friendUsername });

        if (!user || !friend) {
            return res.status(404).send({ message: "User or friend not found" });
        }

        if (!user.friends.includes(friend._id)) {
            return res.status(400).send({ message: "You are not friends with this user" });
        }

        user.friends.pull(friend._id);
        friend.friends.pull(user._id);

        await user.save();
        await friend.save();

        return res.status(200).send({ message: "Successfully unfriended" });
    } catch (err) {
        console.error("Error unfriending:", err);
        return res.status(500).send({ message: "Failed to unfriend" });
    }
});

// Route to fetch non-friends and users not in pending requests
router.get("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const currentUser = await User.findById(id);
        
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch non-friends users
        const nonFriends = await getNonFriends(currentUser);

        res.status(200).json(nonFriends);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send({ message: "Failed to fetch users" });
    }
});

// router.get("/chat/:username", (req,res)=>{
//     const username=req.params;

// })

module.exports = router;
