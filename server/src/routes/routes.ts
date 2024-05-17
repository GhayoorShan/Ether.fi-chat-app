import express from "express";
import { MessageModel } from "../models/Message";
import { getAnalytics } from "../services/userService";
const router = express.Router();

// Route to retrieve analytics data
router.get("/analytics/messages-by-user", getAnalytics);

export default router;
