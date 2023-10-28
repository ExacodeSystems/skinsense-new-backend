import { AnalysisRequest } from "../@types/analysis-request.js";
import { Ingredient } from "../@types/ingredient.js";
import { ingredientsServiceInstance, productServiceInstance } from "./index.js";

export enum BasePointValue {
  POSITIVE_BASE_POINT = 5,
  NEUTRAL_BASE_POINT = 1,
  NEGATIVE_BASE_POINT = -5
}

class AnalyzerService {
  countStringOccurrences = (arr: string[]): { name: string; occurrence: number }[] => {
    const counts: Record<string, number> = {};

    for (const str of arr) {
      if (counts[str]) {
        counts[str]++;
      } else {
        counts[str] = 1;
      }
    }

    // Convert the counts object to an array of objects
    const countsArray: { name: string; occurrence: number }[] = Object.entries(counts).map(([name, occurrence]) => ({
      name,
      occurrence,
    }));

    // Sort the array by the occurrence in descending order
    countsArray.sort((a, b) => b.occurrence - a.occurrence);

    return countsArray;
  }

  getIntersection = <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter(value => array2.includes(value));
  }

  getArrayDifference = <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter(value => !array2.includes(value));
  }

  calculateScore = ({ request, ingredients }: { request: AnalysisRequest, ingredients: (Ingredient | null)[] }) => {
    let totalScore = 0
    let denominator = 0

    let posEffects: string[] = []
    let negEffects: string[] = []

    ingredients.map((ing, index) => {
      if (!ing) return

      const benefits_arr: string[] = ing.benefits?.split(",").map(x => x.trim()) ?? []
      const good_for_arr: string[] = ing.good_for?.split(",").map(x => x.trim()) ?? []
      const skin_types_arr: string[] = ing.good_for_skin_type?.split(",").map(x => x.trim()) ?? []
      const concerns_arr: string[] = ing.concerns?.split(",").map(x => x.trim()) ?? []
      const bad_for_arr: string[] = ing.bad_for?.split(",").map(x => x.trim()) ?? []

      // benefits_arr.map(x => posEffects.push(x))
      good_for_arr.map(x => posEffects.push(x))
      concerns_arr.map(x => negEffects.push(x))
      bad_for_arr.map(x => negEffects.push(x))

      const benefit_intersecting = this.getIntersection(benefits_arr, request.concerns)
      const benefit_difference = this.getArrayDifference(benefits_arr, request.concerns)

      const good_for_intersecting = this.getIntersection(good_for_arr, request.concerns)
      const good_for_difference = this.getArrayDifference(good_for_arr, request.concerns)

      const concerns_intersecting = this.getIntersection(concerns_arr, request.concerns)
      const concerns_difference = this.getArrayDifference(concerns_arr, request.concerns)

      const bad_for_intersecting = this.getIntersection(bad_for_arr, request.concerns)
      const bad_for_difference = this.getArrayDifference(bad_for_arr, request.concerns)

      const skin_types_intersecting = this.getIntersection(skin_types_arr, request.skinTypes)
      const skin_types_difference = this.getArrayDifference(skin_types_arr, request.skinTypes)

      const currentPosBaseScore = BasePointValue.POSITIVE_BASE_POINT - (index / ingredients.length)
      const currentNegBaseScore = BasePointValue.NEGATIVE_BASE_POINT + (index / ingredients.length)

      const posScore = (good_for_intersecting.length * currentPosBaseScore) +
        ((skin_types_intersecting.length > 1 ? 1 : skin_types_intersecting.length) * currentPosBaseScore);
      // (benefit_intersecting.length * currentPosBaseScore)

      const neutScore = (good_for_difference.length * BasePointValue.NEUTRAL_BASE_POINT) +
        (bad_for_difference.length * BasePointValue.NEUTRAL_BASE_POINT * -1)
      // (skin_types_difference.length * BasePointValue.NEUTRAL_BASE_POINT)
      // (benefit_difference.length * BasePointValue.NEUTRAL_BASE_POINT)
      // (concerns_difference.length * BasePointValue.NEUTRAL_BASE_POINT * -1) +

      const negScore = (bad_for_intersecting.length * currentNegBaseScore)
      // (concerns_intersecting.length * currentNegBaseScore)

      totalScore += (posScore + neutScore + negScore)

      denominator += (good_for_arr.length * currentPosBaseScore) +
        (1 * currentPosBaseScore) +
        (bad_for_arr.length * currentNegBaseScore)
      // (benefits_arr.length * currentPosBaseScore) 
      // (concerns_arr.length * currentNegBaseScore) +
    })

    return {
      score: totalScore,
      denominator: denominator,
      posEffects,
      negEffects
    }
  }

  sortIngredients = (ingredients: (Ingredient | null)[]) => {
    const res: Ingredient[] = []

    ingredients.map(x => {
      if (x && x.is_active_ingredients === 1) res.push(x)
    })

    ingredients.map(x => {
      if (x && x.is_active_ingredients === 0) res.push(x)
    })

    return res
  }

  getAnalysis = async (request: AnalysisRequest) => {
    try {
      const { productId, skinTypes, concerns } = request

      const productData = await productServiceInstance.getById(productId);
      if (!productData) throw new Error("Product not found")

      const ing_name_arr = productData.ingredients.split(",").map(x => x.trim())
      const ingredients = await Promise.all(ing_name_arr.map(x => ingredientsServiceInstance.getByName(x)))
      if (ingredients.length < 1) throw new Error("Product does not have enough ingredients")

      const ingredients_sorted = this.sortIngredients(ingredients)

      const { score, denominator, negEffects, posEffects } = this.calculateScore({ request, ingredients: ingredients_sorted })

      return {
        score: score,
        denominator: denominator,
        percentage: score / denominator * 100,
        negEffects: this.countStringOccurrences(negEffects),
        posEffects: this.countStringOccurrences(posEffects)
      }
    } catch (error) {
      throw error
    }
  }
}

export default AnalyzerService