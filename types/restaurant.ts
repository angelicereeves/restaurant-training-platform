// src/types/restaurant.ts

export type RestaurantConfig = {
  slug: string
  name: string
  motto?: string
  about?: string
  values?: string[]

  // existing fields you already use
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  enabledRoles?: string[]

  // NEW (optional) branding expansion
  accentColor?: string
  backgroundColor?: string
  textColor?: string

  // NEW (optional) photo assets
  heroImage?: string
  galleryImages?: string[]
    heroAlt?: string
  heroOverlay?: boolean


}
