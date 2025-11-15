import bcrypt from "bcryptjs"
import type { User, UserPublic } from "./kv-store"
import { mockUsers as initialUsers, mockResults as initialResults } from "@/data/mock-kv-data"

export type MockProfile = {
  status: string
  username: string
  result: Record<string, unknown>
  meta?: unknown
  ts?: number
}

const usersById = new Map<string, User>()
const emailIndex = new Map<string, string>()
const resultsByUsername = new Map<string, MockProfile>()

for (const user of initialUsers) {
  usersById.set(user.id, user)
  emailIndex.set(user.email.toLowerCase(), user.id)
}

for (const [username, profile] of Object.entries(initialResults)) {
  if (!profile || typeof profile !== "object") {
    continue
  }

  const clean = username.toLowerCase()
  resultsByUsername.set(clean, {
    status: profile.status ?? "done",
    username: profile.username ?? username,
    result: profile.result ?? {},
    meta: profile.meta,
    ts: profile.ts,
  })
}

function toPublicUser(user: User): UserPublic {
  const { password_hash, ...publicUser } = user
  return publicUser
}

export async function mockCreateUser(
  email: string,
  name: string,
  password: string,
  username?: string,
): Promise<UserPublic | null> {
  const normalizedEmail = email.toLowerCase()
  if (emailIndex.has(normalizedEmail)) {
    return null
  }

  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const password_hash = await bcrypt.hash(password, 10)
  const created_at = new Date().toISOString()

  const user: User = {
    id,
    email,
    name,
    username,
    password_hash,
    created_at,
  }

  usersById.set(id, user)
  emailIndex.set(normalizedEmail, id)

  return toPublicUser(user)
}

export async function mockVerifyUserPassword(email: string, password: string): Promise<UserPublic | null> {
  const user = await mockFindUserByEmail(email)
  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  return isValid ? toPublicUser(user) : null
}

export async function mockFindUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.toLowerCase()
  const id = emailIndex.get(normalizedEmail)
  if (!id) {
    return null
  }
  return usersById.get(id) ?? null
}

export async function mockFindUserById(id: string): Promise<UserPublic | null> {
  const user = usersById.get(id)
  return user ? toPublicUser(user) : null
}

export async function mockGetProfileByUsername(username: string): Promise<MockProfile | null> {
  const clean = username.toLowerCase()
  return resultsByUsername.get(clean) ?? null
}

export async function mockSetUserUsername(userId: string, username: string): Promise<UserPublic | null> {
  const user = usersById.get(userId)
  if (!user) {
    return null
  }

  user.username = username
  usersById.set(userId, user)
  return toPublicUser(user)
}

export async function mockSavePendingResult(username: string, status: string = "analysis_running"): Promise<MockProfile> {
  const clean = username.toLowerCase()
  const payload: MockProfile = {
    status,
    username: clean,
    result: {},
    ts: Date.now(),
  }

  resultsByUsername.set(clean, payload)
  return payload
}

export async function mockGetProfileForEmail(email: string): Promise<{
  email: string
  user: UserPublic
  profile: MockProfile
} | null> {
  const user = await mockFindUserByEmail(email)
  if (!user) {
    return null
  }

  const username = user.username?.replace(/^@/, "").toLowerCase()
  if (!username) {
    return null
  }

  const profile = await mockGetProfileByUsername(username)
  if (!profile) {
    return null
  }

  return {
    email,
    user: toPublicUser(user),
    profile,
  }
}
