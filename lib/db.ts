import Database from "better-sqlite3"
import { join } from "path"

// Initialize SQLite database
const dbPath = join(process.cwd(), "database.sqlite")
const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

export default db
