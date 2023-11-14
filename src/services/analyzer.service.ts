import { AnalysisRequest } from "../@types/analysis-request.js";
import { Ingredient } from "../@types/ingredient.js";
import { Product } from "../@types/product.js";
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

  getTopThreeFromDictionary = (dictionary: { [id: string]: number }) => {
    // Convert the dictionary into an array of key-value pairs
    const itemsArray = Object.entries(dictionary);

    // Sort the array based on the values in descending order
    const sortedArray = itemsArray.sort((a, b) => b[1] - a[1]);

    // Take the top 3 items
    const top3 = sortedArray.slice(0, 3).map(([key, value]) => {
      return {
        name: key,
        score: value
      }
    });
    return top3
  }

  getBottomThreeFromDictionary = (dictionary: { [id: string]: number }) => {
    // Convert the dictionary into an array of key-value pairs
    const itemsArray = Object.entries(dictionary);

    // Sort the array based on the values in descending order
    const sortedArray = itemsArray.sort((a, b) => a[1] - b[1]);

    // Take the top 3 items
    const bottom3 = sortedArray.slice(0, 3).map(([key, value]) => {
      return {
        name: key,
        score: value
      }
    });
    return bottom3
  }

  calculateScore = ({ request, ingredients }: { request: AnalysisRequest, ingredients: (Ingredient | null)[] }) => {
    let totalScore = 0
    let denominator = 0

    let posEffects: string[] = []
    let negEffects: string[] = []

    let ingDepthAnalysis: { [id: string]: number } = {}
    let skinTypesDepthAnalysis: { [id: string]: number } = {}

    ingredients.map((ing, index) => {
      if (!ing) return

      const benefits_arr: string[] = ing.benefits?.split(",").map(x => x.trim()) ?? []
      const good_for_arr: string[] = ing.good_for?.split(",").map(x => x.trim()) ?? []
      const skin_types_arr: string[] = ing.good_for_skin_type?.split(",").map(x => x.trim()) ?? []
      const bad_for_skin_types_arr: string[] = ing.bad_for_skin_type?.split(",").map(x => x.trim()) ?? []
      const concerns_arr: string[] = ing.concerns?.split(",").map(x => x.trim()) ?? []
      const bad_for_arr: string[] = ing.bad_for?.split(",").map(x => x.trim()) ?? []

      // benefits_arr.map(x => posEffects.push(x))
      good_for_arr.map(x => posEffects.push(x))
      concerns_arr.map(x => negEffects.push(x))
      bad_for_arr.map(x => negEffects.push(x))

      // const benefit_intersecting = this.getIntersection(benefits_arr, request.concerns)
      // const benefit_difference = this.getArrayDifference(benefits_arr, request.concerns)

      const good_for_intersecting = this.getIntersection(good_for_arr, request.concerns)
      const good_for_difference = this.getArrayDifference(good_for_arr, request.concerns)

      // const concerns_intersecting = this.getIntersection(concerns_arr, request.concerns)
      // const concerns_difference = this.getArrayDifference(concerns_arr, request.concerns)

      const bad_for_intersecting = this.getIntersection(bad_for_arr, request.concerns)
      const bad_for_difference = this.getArrayDifference(bad_for_arr, request.concerns)

      const skin_types_intersecting = this.getIntersection(skin_types_arr, request.skinTypes)
      const skin_types_difference = this.getArrayDifference(skin_types_arr, request.skinTypes)

      const bad_for_skin_types_intersecting = this.getIntersection(bad_for_skin_types_arr, request.skinTypes)
      const bad_for_skin_types_difference = this.getArrayDifference(bad_for_skin_types_arr, request.skinTypes)

      const currentPosBaseScore = BasePointValue.POSITIVE_BASE_POINT - (index / ingredients.length)
      const currentNegBaseScore = BasePointValue.NEGATIVE_BASE_POINT + (index / ingredients.length)

      const posScore = (good_for_intersecting.length * currentPosBaseScore) +
        (skin_types_intersecting.length * currentPosBaseScore)
      // ((skin_types_intersecting.length > 1 ? 1 : skin_types_intersecting.length) * currentPosBaseScore);
      // (benefit_intersecting.length * currentPosBaseScore)

      const neutScore = (good_for_difference.length * BasePointValue.NEUTRAL_BASE_POINT) +
        (skin_types_difference.length * BasePointValue.NEUTRAL_BASE_POINT) +
        (bad_for_difference.length * BasePointValue.NEUTRAL_BASE_POINT * -1)
      // (benefit_difference.length * BasePointValue.NEUTRAL_BASE_POINT)
      // (concerns_difference.length * BasePointValue.NEUTRAL_BASE_POINT * -1) +

      const negScore = (bad_for_intersecting.length * currentNegBaseScore) +
        (bad_for_skin_types_intersecting.length * currentNegBaseScore)
      // (concerns_intersecting.length * currentNegBaseScore)

      // Create In Depth Scoring
      good_for_intersecting.map(x => {
        if (!ingDepthAnalysis[x]) ingDepthAnalysis[x] = 0
        ingDepthAnalysis[x] = ingDepthAnalysis[x] + currentPosBaseScore
      })
      bad_for_intersecting.map(x => {
        if (!ingDepthAnalysis[x]) ingDepthAnalysis[x] = 0
        ingDepthAnalysis[x] = ingDepthAnalysis[x] + currentNegBaseScore
      })
      good_for_difference.map(x => {
        if (!ingDepthAnalysis[x]) ingDepthAnalysis[x] = 0
        ingDepthAnalysis[x] = ingDepthAnalysis[x] + BasePointValue.NEUTRAL_BASE_POINT
      })
      bad_for_difference.map(x => {
        if (!ingDepthAnalysis[x]) ingDepthAnalysis[x] = 0
        ingDepthAnalysis[x] = ingDepthAnalysis[x] - BasePointValue.NEUTRAL_BASE_POINT
      })
      skin_types_intersecting.map(x => {
        if (!skinTypesDepthAnalysis[x]) skinTypesDepthAnalysis[x] = 0
        skinTypesDepthAnalysis[x] = skinTypesDepthAnalysis[x] + currentPosBaseScore
      })
      skin_types_difference.map(x => {
        if (!skinTypesDepthAnalysis[x]) skinTypesDepthAnalysis[x] = 0
        skinTypesDepthAnalysis[x] = skinTypesDepthAnalysis[x] + BasePointValue.NEUTRAL_BASE_POINT
      })
      bad_for_skin_types_intersecting.map(x => {
        if (!skinTypesDepthAnalysis[x]) skinTypesDepthAnalysis[x] = 0
        skinTypesDepthAnalysis[x] = skinTypesDepthAnalysis[x] + currentNegBaseScore
      })
      bad_for_skin_types_difference.map(x => {
        if (!skinTypesDepthAnalysis[x]) skinTypesDepthAnalysis[x] = 0
        skinTypesDepthAnalysis[x] = skinTypesDepthAnalysis[x] - BasePointValue.NEUTRAL_BASE_POINT
      })

      totalScore += (posScore + neutScore + negScore)

      denominator += (good_for_arr.length * currentPosBaseScore) +
        (skin_types_arr.length * currentPosBaseScore) +
        (bad_for_arr.length * currentNegBaseScore)
    })

    return {
      score: totalScore,
      denominator: denominator,
      posEffects,
      negEffects,
      ingDepthAnalysis,
      skinTypesDepthAnalysis
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

  preprocessIngredientsString = (ingredientsString: string): string[] => {
    return ingredientsString.split(",").map(x => x.trim().toLowerCase())
  }

  flattenArray = (array: any[]): string[] => {
    const flattened = array.map(x => x.split(",").map((y: string) => y.trim())).flat()
    return [...new Set(flattened)]
  }

  getPercentage = (score: number, denominator: number): number => {
    const percentage = score / denominator * 100
    if (percentage > 100) return 100
    else if (percentage < 0) return 0
    else return percentage
  }

  getAnalysis = async (request: AnalysisRequest) => {
    try {
      const { productId, skinTypes, concerns, ingredients: ingredientsString } = request

      let ing_name_arr: string[] = []
      let productData: Product | null = null

      if (productId) {
        productData = await productServiceInstance.getById(productId);
        if (!productData) throw new Error("Product not found")

        ing_name_arr = this.preprocessIngredientsString(productData.ingredients)
      } else if (ingredientsString) {
        ing_name_arr = this.preprocessIngredientsString(ingredientsString)
      }

      // If no ingredients found
      if (ing_name_arr.length < 1) throw new Error("Analyzer can't find any ingredients")

      const ingredients = await Promise.all(ing_name_arr.map(x => ingredientsServiceInstance.getByName(x)))
      if (ingredients.length < 1) throw new Error("Product does not have enough ingredients")

      const ingredients_sorted = this.sortIngredients(ingredients)
      const similarProducts = await productServiceInstance.getSimilar(ingredients.map(x => x?.name).join(","))
      const goodForSkinType = this.flattenArray(ingredients.map(x => x?.good_for_skin_type).filter(x => x && x !== ""))
      const badForSkinType = this.flattenArray(ingredients.map(x => x?.bad_for_skin_type).filter(x => x && x !== ""))
      const goodFor = this.flattenArray(ingredients.map(x => x?.good_for).filter(x => x && x !== ""))
      const badFor = this.flattenArray(ingredients.map(x => x?.bad_for).filter(x => x && x !== ""))
      const incompatibleIngredients = this.flattenArray(ingredients.map(x => x?.incompatible_ingredients).filter(x => x && x !== ""))
      const additionalDescriptions = this.flattenArray(ingredients.map(x => x?.additional_description).filter(x => x && x !== ""))

      const { score, denominator, negEffects, posEffects, ingDepthAnalysis, skinTypesDepthAnalysis } = this.calculateScore({ request, ingredients: ingredients_sorted })

      return {
        id: Date.now(),
        score: score,
        denominator: denominator,
        percentage: this.getPercentage(score, denominator),
        negEffects: this.countStringOccurrences(negEffects),
        posEffects: this.countStringOccurrences(posEffects),
        ingredients: ingredients_sorted,
        product: productData,
        similarProducts,
        // goodForSkinType: this.countStringOccurrences(goodForSkinType),
        // badForSkinType: this.countStringOccurrences(badForSkinType),
        // goodFor,
        // badFor,
        incompatibleIngredients,
        additionalDescriptions,
        goodFor: this.getTopThreeFromDictionary(ingDepthAnalysis).map(x => x.name),
        goodForSkinType: this.getTopThreeFromDictionary(skinTypesDepthAnalysis).map(x => x.name),
        badFor: this.getBottomThreeFromDictionary(ingDepthAnalysis).map(x => x.name),
        badForSkinType: this.getBottomThreeFromDictionary(skinTypesDepthAnalysis).map(x => x.name)
      }
    } catch (error) {
      throw error
    }
  }
}

export default AnalyzerService