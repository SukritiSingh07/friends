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
      type: String, 
    },
  ],
  pendingReq: [
    {
      type :String,
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
