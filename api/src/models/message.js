const mongoose = require("mongoose");

const MODELNAME = "message";

const Schema = new mongoose.Schema({
  projectId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  organisation: { type: String, trim: true },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
