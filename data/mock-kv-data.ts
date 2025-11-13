import type { User } from "@/lib/kv-store"

type RawMockProfile = {
  status?: string
  username?: string
  result?: Record<string, unknown>
  meta?: unknown
  ts?: number
}

export const mockUsers: User[] = [
  // Örnek kullanıcı - kendi verilerinizi buraya ekleyin
  // {
  //   id: "user_1234567890",
  //   email: "demo@example.com",
  //   name: "Demo Kullanıcı",
  //   username: "demokullanici",
  //   password_hash: "$2a$10$gYzV8pXqPnJzrYFz0Yj5JO1ZYkTfGZNVVRFl1kYyqS/fWznuaCG2", // "demo1234"
  //   created_at: "2024-01-01T00:00:00.000Z",
  // },
]

export const mockResults: Record<string, RawMockProfile> = {
  // demokullanici: {
  //   status: "done",
  //   username: "demokullanici",
  //   result: {
  //     profile_summary: "Buraya profil özeti içeriği kopyalayın.",
  //   },
  //   ts: Date.now(),
  // },
}
