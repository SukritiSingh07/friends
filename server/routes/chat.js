const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const  ChatRoom=require('../models/ChatRoom');
const Message = require('../models/Message');

router.get('/chat-room/:chatRoomId', async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    // Find the chat room by ID and populate the messages array
    const chatRoom = await ChatRoom.findById(chatRoomId).populate('messages');

    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    // Return the chat room with detailed messages
    res.status(200).json({
      chatRoomId: chatRoom._id,
      users: chatRoom.users,
      messages: chatRoom.messages, // Nested messages array
      createdAt: chatRoom.createdAt,
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Unable to fetch messages' });
  }
});


router.post('/send-message', async (req, res) => {
  const { chatRoomId, message } = req.body;
  // console.log(chatRoomId);
  // console.log(req.user.id);
  const senderId=req.user.id;
  // console.log(senderId);

  if (!chatRoomId || !senderId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newMessage = new Message({
      senderId: senderId,
      text: message,
      createdAt: new Date(),
    });

    await newMessage.save();

    const updatedChatRoom = await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      { $push: { messages: newMessage } }, // Add message to chat room's messages array
      { new: true } // Return the updated document
    );
    if (!updatedChatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }
    const sender = await User.findById(senderId);
    res.json({
      _id: newMessage._id,
      chatRoomId,
      sender: { username: sender.username }, // Assuming sender has a 'username' field
      message,
      timestamp: newMessage.timestamp,
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Unable to send message' });
  }
});

module.exports = router;
