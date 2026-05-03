import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firebaseId = searchParams.get("firebaseId");

  if (!firebaseId) {
    return NextResponse.json({ error: "Missing firebaseId" }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ firebaseId });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { firebaseId, email, name, role, mobile } = body;

    let user = await User.findOne({ firebaseId });

    if (!user) {
      user = await User.create({
        firebaseId,
        email,
        name,
        role: role || "user",
        mobile,
      });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
