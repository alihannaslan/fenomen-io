// Cloudflare KV storage helper functions
// This file provides user storage operations using Cloudflare KV

import type { KVNamespace } from "@cloudflare/workers-types"
import bcrypt from "bcryptjs"

const useLocalMock = process.env.USE_LOCAL_KV === "true"

type MockModule = typeof import("./mock-kv")
let mockModulePromise: Promise<MockModule> | null = null

async function loadMockModule(): Promise<MockModule> {
  if (!mockModulePromise) {
    mockModulePromise = import("./mock-kv")
  }
  return mockModulePromise
}

export interface User {
  id: string
  email: string
  name: string
  username?: string
  password_hash: string
  created_at: string
}

export interface UserPublic {
  id: string
  email: string
  name: string
  username?: string
  created_at: string
}

export interface Env {
  USERS_KV: KVNamespace
  JWT_SECRET: string
}

// Create a new user in KV
export async function createUser(
  kv: KVNamespace | undefined,
  email: string,
  name: string,
  password: string,
  username?: string,
): Promise<UserPublic | null> {
  try {
    if (useLocalMock) {
      const mod = await loadMockModule()
      return mod.mockCreateUser(email, name, password, username)
    }

    if (!kv) {
      console.error("Error creating user: KV namespace unavailable")
      return null
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(kv, email)
    if (existingUser) {
      return null
    }

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user object
    const user: User = {
      id: userId,
      email,
      name,
      username,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    }

    // Store user by ID
    await kv.put(`user:${userId}`, JSON.stringify(user))

    // Store email index for lookup
    await kv.put(`email:${email}`, userId)

    // Return public user data
    const { password_hash, ...publicUser } = user
    return publicUser
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Find user by email
export async function findUserByEmail(kv: KVNamespace | undefined, email: string): Promise<User | null> {
  try {
    if (useLocalMock) {
      const mod = await loadMockModule()
      return mod.mockFindUserByEmail(email)
    }

    if (!kv) {
      console.error("Error finding user by email: KV namespace unavailable")
      return null
    }

    // Get user ID from email index
    const userId = await kv.get(`email:${email}`)
    if (!userId) {
      return null
    }

    // Get user data
    const userData = await kv.get(`user:${userId}`)
    if (!userData) {
      return null
    }

    return JSON.parse(userData) as User
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

// Find user by ID
export async function findUserById(kv: KVNamespace | undefined, id: string): Promise<UserPublic | null> {
  try {
    if (useLocalMock) {
      const mod = await loadMockModule()
      return mod.mockFindUserById(id)
    }

    if (!kv) {
      console.error("Error finding user by ID: KV namespace unavailable")
      return null
    }

    const userData = await kv.get(`user:${id}`)
    if (!userData) {
      return null
    }

    const user = JSON.parse(userData) as User
    const { password_hash, ...publicUser } = user
    return publicUser
  } catch (error) {
    console.error("Error finding user by ID:", error)
    return null
  }
}

// Verify user password
export async function verifyUserPassword(
  kv: KVNamespace | undefined,
  email: string,
  password: string,
): Promise<UserPublic | null> {
  try {
    if (useLocalMock) {
      const mod = await loadMockModule()
      return mod.mockVerifyUserPassword(email, password)
    }

    if (!kv) {
      console.error("Error verifying user: KV namespace unavailable")
      return null
    }

    const user = await findUserByEmail(kv, email)
    if (!user) {
      return null
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return null
    }

    // Return public user data
    const { password_hash, ...publicUser } = user
    return publicUser
  } catch (error) {
    console.error("Error verifying user:", error)
    return null
  }
}
