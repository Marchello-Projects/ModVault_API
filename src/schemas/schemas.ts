import { z } from "zod";
import { UserCore } from "./user.ts"
import { ModCore } from "./mod.ts"
import { CategoryCore } from "./category.ts"

export type User = z.infer<typeof UserCore> & {
  mods?: Mod[]
}

export type Mod = z.infer<typeof ModCore> & {
  author?: User
  categories?: Category[]
}

export type Category = z.infer<typeof CategoryCore> & {
  mods?: Mod[]
}

export const UserSchema = (UserCore as any).extend({
  mods: z.lazy(() => ModSchema.array()).optional(),
}) as z.ZodType<User>

export const ModSchema = (ModCore as any).extend({
  author: z.lazy(() => UserSchema).optional(),
  categories: z.lazy(() => CategorySchema.array()).optional(),
}) as z.ZodType<Mod>

export const CategorySchema = (CategoryCore as any).extend({
  mods: z.lazy(() => ModSchema.array()).optional(),
}) as z.ZodType<Category>