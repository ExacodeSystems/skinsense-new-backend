import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
const controller = new ProductController()

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

export default router;