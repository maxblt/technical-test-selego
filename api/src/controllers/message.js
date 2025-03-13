const express = require("express");
const passport = require("passport");
const router = express.Router();

const MessageObject = require("../models/message");
const UserObject = require("../models/user");

const SERVER_ERROR = "SERVER_ERROR";

// Get all messages for a specific project
router.get("/project/:projectId", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const data = await MessageObject.find({
      projectId: req.params.projectId,
      organisation: req.user.organisation,
    }).sort("created_at");
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

// Create a new message
router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const data = await MessageObject.create({
      ...req.body,
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      organisation: req.user.organisation,
    });
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

// Delete a message (only by the author)
router.delete("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const message = await MessageObject.findById(req.params.id);

    // Check if user is the author of the message
    if (message.userId !== req.user._id.toString()) {
      return res.status(403).send({ ok: false, code: "UNAUTHORIZED" });
    }

    await MessageObject.findByIdAndDelete(req.params.id);
    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
