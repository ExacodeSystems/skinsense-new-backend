import AnalyzerService from "./analyzer.service.js";
import AuthService from "./auth.service.js";
import IngredientService from "./ingredient.service.js";
import ProductService from "./product.service.js";
import ReviewService from "./review.service.js";
import UserService from "./user.service.js";

const productServiceInstance = new ProductService()
const analyzerServiceInstance = new AnalyzerService()
const ingredientsServiceInstance = new IngredientService()
const userServiceInstance = new UserService()
const authServiceInstance = new AuthService()
const reviewServiceInstance = new ReviewService()

export {
  productServiceInstance,
  analyzerServiceInstance,
  ingredientsServiceInstance,
  userServiceInstance,
  authServiceInstance,
  reviewServiceInstance
}