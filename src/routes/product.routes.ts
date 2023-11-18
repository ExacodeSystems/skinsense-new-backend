import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
const controller = new ProductController()

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/:id/review", controller.getReviews);
router.get("/similar/search", controller.getSimilar);

export default router;
