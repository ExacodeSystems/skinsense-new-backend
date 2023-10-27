export interface Ingredient {
  id: number,
  name: string,
  categories: string | null,
  benefits: string | null,
  concerns: string | null,
  description: string,
  purposes: string | null, 
  good_for: string | null,
  bad_for: string | null,
  good_for_skin_type: string | null,
  bad_for_skin_type: string | null,
  incompatible_ingredients: string | null,
  enhancer: string | null,
  is_active_ingredients: number | null,
  references: string | null,
  cosing_id: number,
  additional_description: string | null,
}