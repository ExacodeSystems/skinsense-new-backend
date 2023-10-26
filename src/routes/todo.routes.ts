import express from "express";
import TodoController from "../controllers/todo.controller.js";

const router = express.Router();
const controller = new TodoController()

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
