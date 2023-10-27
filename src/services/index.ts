import AnalyzerService from "./analyzer.service.js";
import IngredientService from "./ingredient.service.js";
import ProductService from "./product.service.js";

const productServiceInstance = new ProductService()
const analyzerServiceInstance = new AnalyzerService()
const ingredientsServiceInstance = new IngredientService()

export {
  productServiceInstance,
  analyzerServiceInstance,
  ingredientsServiceInstance
}