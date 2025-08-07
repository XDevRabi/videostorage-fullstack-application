import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Register a new user /api/auth/register
// POST /api/auth/register
// {
//   "email": "user@example.com",
//   "password": "password123"
// }
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    // Create a new user
    await User.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 400 }
    );
  }
}
