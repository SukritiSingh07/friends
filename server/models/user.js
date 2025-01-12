const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      username: {
        type: String, 
        required: true,
      },
      chat_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
    },
  ],
  pendingReq: [
    {
      type :String,
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
