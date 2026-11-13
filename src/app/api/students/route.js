import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("GET /api/students:", error);
    return NextResponse.json(
      { success: false, message: "Could not load students. Check MongoDB is running." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const department = typeof body.department === "string" ? body.department.trim() : "";

    if (!name || !email || !phone || !department) {
      return NextResponse.json(
        { success: false, message: "Name, email, phone and department are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await Student.create({ name, email, phone, department });

    return NextResponse.json(
      { success: true, message: "Student added successfully.", data: student },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This email address is already registered." },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    console.error("POST /api/students:", error);
    return NextResponse.json(
      { success: false, message: "Could not add student. Check MongoDB connection." },
      { status: 500 }
    );
  }
}
