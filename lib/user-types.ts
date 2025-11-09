// lib/user-types.ts
export type DashboardUser = {
  email: string
  name?: string // null normalize edeceğiz => undefined
  id?: string | number
  created_at?: string | number | Date
}
