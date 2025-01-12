const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const chatRoomSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],  
  createdAt: { type: Date, default: Date.now }
});

chatRoomSchema.index({ users: 1 }, { unique: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
