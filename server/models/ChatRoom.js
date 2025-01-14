const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],  
  createdAt: { type: Date, default: Date.now }
});

chatRoomSchema.index({ users: 1 }, { unique: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
