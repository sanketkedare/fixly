import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { SERVICES } from "@/data/services";

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(SERVICES);
  }
  try {
    await connectDB();
    const services = await Service.find({});
    if (!services || services.length === 0) {
      return NextResponse.json(SERVICES);
    }
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(SERVICES);
  }
}

export async function POST(request: Request) {
  if (!process.env.MONGODB_URI) {
    try {
      const body = await request.json();
      return NextResponse.json(body, { status: 201 });
    } catch {
      return NextResponse.json({ error: "Failed to parse body" }, { status: 400 });
    }
  }
  try {
    await connectDB();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

