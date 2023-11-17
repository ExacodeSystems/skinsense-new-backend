import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();
const controller = new UserController()

router.get("/:id", controller.getById);
router.post("/", controller.create);

export default router;
