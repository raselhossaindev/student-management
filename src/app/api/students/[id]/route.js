import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";

export const runtime = "nodejs";

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID." },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await Student.findById(id).lean();

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("GET /api/students/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Could not retrieve student." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const department = typeof body.department === "string" ? body.department.trim() : "";

    if (!name || !email || !phone || !department) {
      return NextResponse.json(
        { success: false, message: "All four fields are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, phone, department },
      { new: true, runValidators: true }
    );

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This email address is already used by another student." },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    console.error("PUT /api/students/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Could not update student." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID." },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/students/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Could not delete student." },
      { status: 500 }
    );
  }
}
