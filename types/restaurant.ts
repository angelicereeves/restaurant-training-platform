//types/restaurant.ts
export interface RestaurantConfig {
  slug?: string
  name: string
  motto?: string
  about?: string
  values?: string[]
  logo: string
  primaryColor: string
  secondaryColor: string
  enabledRoles: string[]
}
