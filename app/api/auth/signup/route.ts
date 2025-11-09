import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Create user
    const user = await createUser(email, password, name)

    if (!user) {
      return NextResponse.json({ error: "User already exists or could not be created" }, { status: 400 })
    }

    // Create session
    const token = await createSession(user.id, user.email)
    await setSessionCookie(token)

    console.log("[v0] User signed up successfully:", user.email)

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
