const membersService = require("../service/membersService");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const members = await membersService.getAllMembers();
    return res.json(members);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }

    const member = await membersService.getMemberById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    return res.json(member);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const member = req.body;
    const status = await membersService.addMember(member);
    return res.json(status);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }

    const member = req.body;
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const status = await membersService.updateMember(id, member);
    return res.json(status);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }
    const status = await membersService.deleteMember(id);
    return res.json(status);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

module.exports = router;
