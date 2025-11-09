import bcrypt from "bcryptjs"
import db from "./db"
import { initDatabase } from "./init-db"

// Ensure database is initialized
initDatabase()

export interface User {
  id: number
  email: string
  name?: string
  created_at: string
}

export async function createUser(email: string, password: string, name?: string): Promise<User | null> {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
    const result = stmt.run(email, hashedPassword, name || null)

    // Return created user (without password)
    const user = db
      .prepare("SELECT id, email, name, created_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid) as User
    return user
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return null
  }
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  try {
    // Get user with password
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any

    if (!user) {
      return null
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return null
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    }
  } catch (error) {
    console.error("[v0] Error verifying user:", error)
    return null
  }
}

export function getUserById(id: number): User | null {
  try {
    const user = db.prepare("SELECT id, email, name, created_at FROM users WHERE id = ?").get(id) as User | undefined
    return user || null
  } catch (error) {
    console.error("[v0] Error getting user:", error)
    return null
  }
}

export function getUserByEmail(email: string): User | null {
  try {
    const user = db.prepare("SELECT id, email, name, created_at FROM users WHERE id = ?").get(email) as User | undefined
    return user || null
  } catch (error) {
    console.error("[v0] Error getting user:", error)
    return null
  }
}
