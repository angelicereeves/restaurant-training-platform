import fs from "fs"
import path from "path"
import { RestaurantConfig } from "@/types/restaurant"
import { Role } from "@/types/role"
import { Module } from "@/types/module"
import { Lesson } from "@/types/lesson"
import { Checklist } from "@/types/checklist"

export interface RestaurantData {
  slug: string
  config: RestaurantConfig
  roles: Role[]
  modules: Module[]
  lessons: Lesson[]
  checklists: Checklist[]
}

/**
 * Simple in-memory cache to avoid re-reading JSON files on every navigation in dev.
 * Note: JSON edits won't reflect until you restart the dev server.
 */
const cache = new Map<string, RestaurantData>()

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback

  const raw = fs.readFileSync(filePath, "utf-8").trim()
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    throw new Error(`Invalid JSON in file: ${filePath}`)
  }
}

export function getRestaurant(slug: string): RestaurantData {
  if (!slug || typeof slug !== "string") {
    throw new Error("getRestaurant was called with an invalid or empty slug")
  }

  const normalizedSlug = slug.trim()
  if (!normalizedSlug) {
    throw new Error("getRestaurant was called with an invalid or empty slug")
  }

  // Cache hit
  const cached = cache.get(normalizedSlug)
  if (cached) return cached

  const basePath = path.join(process.cwd(), "restaurants", normalizedSlug)

  const configPath = path.join(basePath, "config.json")
  const rolesPath = path.join(basePath, "roles.json")
  const modulesPath = path.join(basePath, "modules.json")
  const lessonsPath = path.join(basePath, "lessons.json")
  const checklistsPath = path.join(basePath, "checklists.json")

  if (!fs.existsSync(configPath)) {
    throw new Error(`Restaurant not found: ${normalizedSlug}`)
  }

  const config = readJsonFile<RestaurantConfig>(
    configPath,
    {} as RestaurantConfig
  )

  const roles = readJsonFile<Role[]>(rolesPath, [])
  const modules = readJsonFile<Module[]>(modulesPath, [])
  const lessons = readJsonFile<Lesson[]>(lessonsPath, [])
  const checklists = readJsonFile<Checklist[]>(checklistsPath, [])

  const data: RestaurantData = {
    slug: normalizedSlug,
    config,
    roles,
    modules,
    lessons,
    checklists,
  }

  cache.set(normalizedSlug, data)
  return data
}
