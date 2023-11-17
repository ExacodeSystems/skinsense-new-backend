import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();
const controller = new AuthController()

router.post("/", controller.auth);

export default router;
