const subscriptionsService = require("../service/subscriptionsService");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const subscriptions = await subscriptionsService.getAllSubscriptions();
    return res.json(subscriptions);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/details", async (req, res) => {
  try {
    const subscriptions = await subscriptionsService.getAllSubscriptionsWithDetails();
    if (!subscriptions) {
      return res.status(404).json({ error: "No subscriptions found" });
    }
    return res.json(subscriptions);
  } catch (e) {
    console.error("Error in /details:", e);
    return res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }

    const subscription = await subscriptionsService.getSubscriptionById(id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    return res.json(subscription);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const subscription = req.body;
    const status = await subscriptionsService.addSubscription(subscription);
    return res.json(status);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }

    const subscription = req.body;
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const status = await subscriptionsService.updateSubscription(
      id,
      subscription
    );
    return res.json(status);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }
    const status = await subscriptionsService.deleteSubscription(id);
    return res.json(status);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
