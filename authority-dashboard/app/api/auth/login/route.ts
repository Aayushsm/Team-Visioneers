import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Mock user data - replace with actual database
const users = [
  {
    id: "1",
    email: "admin@tourism.gov",
    password: "$2a$10$rOzJqKqQQQQQQQQQQQQQQu", // hashed 'password123'
    name: "Tourism Authority Admin",
    role: "admin",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
