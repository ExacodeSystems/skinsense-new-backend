import { AnalysisRequest } from "../@types/analysis-request.js";
import { Ingredient } from "../@types/ingredient.js";
import { ingredientsServiceInstance, productServiceInstance } from "./index.js";

export enum BasePointValue {
  POSITIVE_BASE_POINT = 5,
  NEUTRAL_BASE_POINT = 1,
  NEGATIVE_BASE_POINT = 5
}

class AnalyzerService {
  getIntersection = <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter(value => array2.includes(value));
  }

  getArrayDifference = <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter(value => !array2.includes(value));
  }

  calculateScore = ({ request, ingredients }: { request: AnalysisRequest, ingredients: (Ingredient | null)[] }) => {
    const totalScore = ingredients.map((ing, index) => {
      if(!ing) return

      const benefits_arr: string[] = ing.benefits?.split(",").map(x => x.trim()) ?? []
      const good_for_arr: string[] = ing.good_for?.split(",").map(x => x.trim()) ?? []
      const concerns_arr: string[] = ing.concerns?.split(",").map(x => x.trim()) ?? []
      const bad_for_arr: string[] = ing.bad_for?.split(",").map(x => x.trim()) ?? []

      const benefit_intersecting = this.getIntersection(benefits_arr, request.concerns)
      const benefit_difference = this.getArrayDifference(benefits_arr, request.concerns)

      const good_for_intersecting = this.getIntersection(benefits_arr, request.concerns)
      const good_for_difference = this.getArrayDifference(benefits_arr, request.concerns)

      const concerns_intersecting = this.getIntersection(benefits_arr, request.concerns)
      const concerns_difference = this.getArrayDifference(benefits_arr, request.concerns)

      const bad_for_intersecting = this.getIntersection(benefits_arr, request.concerns)
      const bad_for_difference = this.getArrayDifference(benefits_arr, request.concerns)

      const currentPosBaseScore = BasePointValue.POSITIVE_BASE_POINT - (index / ingredients.length)
      const currentNegBaseScore = BasePointValue.NEGATIVE_BASE_POINT + (index / ingredients.length)

      return
      (benefit_intersecting.length * currentPosBaseScore) +
        (good_for_intersecting.length * currentPosBaseScore) +
        (concerns_intersecting.length * currentNegBaseScore) +
        (bad_for_intersecting.length * currentNegBaseScore) +
        (benefit_difference.length * BasePointValue.NEUTRAL_BASE_POINT) +
        (good_for_difference.length * BasePointValue.NEUTRAL_BASE_POINT) +
        (concerns_difference.length * BasePointValue.NEUTRAL_BASE_POINT) -
        (bad_for_difference.length * BasePointValue.NEUTRAL_BASE_POINT)
    })

    return totalScore
  }

  getAnalysis = async (request: AnalysisRequest) => {
    try {
      const { productId, skinType, concerns } = request
      const productData = await productServiceInstance.getById(productId);
      if (!productData) throw new Error("Product not found")

      const ing_name_arr = productData.ingredients.split(",").map(x => x.trim())
      const ingredients = await Promise.all(ing_name_arr.map(x => ingredientsServiceInstance.getByName(x)))
      if (ingredients.length < 1) throw new Error("Product does not have enough ingredients")

      const totalScoreforBenefits = this.calculateScore({ request, ingredients })

      return ingredients
    } catch (error) {
      throw error
    }
  }
}

export default AnalyzerService