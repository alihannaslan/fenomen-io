import { NextResponse } from "next/server"
import { clearSession } from "@/lib/session"

export const runtime = "edge"

export async function POST() {
  try {
    await clearSession()

    console.log("[v0] User logged out successfully")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
