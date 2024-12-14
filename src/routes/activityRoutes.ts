import express from "express";
import { activityLogRepository } from "../repositories/ActivityLogRepository";
const router = express.Router();

router.get("/", async (req, res:any) => {
  try {
    const activities = await activityLogRepository.getAllActivityLogs();
    return res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving activities" });
  }
});

export default router;