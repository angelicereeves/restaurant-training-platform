// types/module.ts
export type Module = {
  id: string
  roleId: string

  // You can use either, but prefer title in JSON
  title?: string
  name?: string

  description: string

  estimatedMinutes?: number
  lessonIds?: string[]
  order?: number
}
