import express from "express";
import ReviewController from "../controllers/review.controller.js";

const router = express.Router();
const controller = new ReviewController()

router.get("/:id", controller.getById);
router.post("/", controller.create);

export default router;
