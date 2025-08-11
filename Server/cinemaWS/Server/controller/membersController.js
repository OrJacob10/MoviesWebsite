const express = require("express");
const membersService = require("../service/membersService");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const members = await membersService.getMembers();
    res.json(members);
  } catch (error) {
    next(error); 
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: "Invalid ID format" });
    }

    const member = await membersService.getMemberById(id);
    if (!member) {
      return next({ status: 404, message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    next(error); 
  }
});

router.post("/", async (req, res, next) => {
  try {
    const memberData = req.body;

    if (!memberData.name || !memberData.email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    const newMember = await membersService.addMember(memberData);
    res.status(201).json(newMember);
    
  } catch (error) {
    if (error.response.data.message === "Email already exists") {
      return res.status(400).json({ message: error.response.data.message });
    }
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: "Invalid ID format" });
    }

    const updatedData = req.body;

    const updatedMember = await membersService.updateMember(id, updatedData);
    if (!updatedMember) {
      return next({ status: 404, message: "Member not found" });
    }

    res.json(updatedMember);
  } catch (error) {
    next(error); 
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: "Invalid ID format" });
    }

    const deletedMember = await membersService.deleteMember(id);
    if (!deletedMember) {
      return next({ status: 404, message: "Member not found" });
    }

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
