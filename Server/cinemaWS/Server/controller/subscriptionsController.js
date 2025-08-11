const express = require("express");
const subscriptionsService = require("../service/subscriptionsService");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try { 
    const subscriptions = await subscriptionsService.getSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    next(error); 
  }
});

router.get("/details", async (req, res, next) => {
  try {
    const subscriptions = await subscriptionsService.getSubscriptionsWithDetails();
    res.json(subscriptions);
    console.log(subscriptions);
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

    const subscription = await subscriptionsService.getSubscriptionById(id);
    if (!subscription) {
      return next({ status: 404, message: "Subscription not found" });
    }

    res.json(subscription);
  } catch (error) {
    next(error); 
  }
});

router.post("/", async (req, res, next) => {
  try {
    const subscriptionData = req.body;

    if (!subscriptionData.memberId || !subscriptionData.movieId) {
      return next({ status: 400, message: "memberId and movieId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(subscriptionData.memberId) || 
        !mongoose.Types.ObjectId.isValid(subscriptionData.movieId)) {
      return next({ status: 400, message: "Invalid ID input" });
    }

    const newSubscription = await subscriptionsService.addSubscription(subscriptionData);
    res.status(201).json(newSubscription);
  } catch (error) {
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
    const updatedSubscription = await subscriptionsService.updateSubscription(id, updatedData);

    if (!updatedSubscription) {
      return next({ status: 404, message: "Subscription not found" });
    }

    res.json(updatedSubscription);
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

    const deletedSubscription = await subscriptionsService.deleteSubscription(id);
    if (!deletedSubscription) {
      return next({ status: 404, message: "Subscription not found" });
    }

    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
