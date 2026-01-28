import fs from "fs"
import path from "path"
import { RestaurantConfig } from "@/types/restaurant"
import { Role } from "@/types/role"
import { Module } from "@/types/module"
import { Lesson } from "@/types/lesson"

interface RestaurantData {
  slug: string
  config: RestaurantConfig
  roles: Role[]
  modules: Module[]
  lessons: Lesson[]
}

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

  const basePath = path.join(process.cwd(), "restaurants", slug)

  const configPath = path.join(basePath, "config.json")
  const rolesPath = path.join(basePath, "roles.json")
  const modulesPath = path.join(basePath, "modules.json")
  const lessonsPath = path.join(basePath, "lessons.json")

  if (!fs.existsSync(configPath)) {
    throw new Error(`Restaurant not found: ${slug}`)
  }

  const config = readJsonFile<RestaurantConfig>(
    configPath,
    {} as RestaurantConfig
  )
  const roles = readJsonFile<Role[]>(rolesPath, [])
  const modules = readJsonFile<Module[]>(modulesPath, [])
  const lessons = readJsonFile<Lesson[]>(lessonsPath, [])

  return { slug, config, roles, modules, lessons }
}
