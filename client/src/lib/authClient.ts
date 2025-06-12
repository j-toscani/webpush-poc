import { createAuthClient } from "better-auth/react"
import { Recipe } from "../client/index.ts";

export const authClient = createAuthClient()

export function isOwnRecipe(sessionData: { user: { id: string } } | null, recipe: Recipe | null): boolean {
  if (!recipe || !sessionData) return false
  return parseInt(sessionData.user.id, 10) === recipe.user_id
}