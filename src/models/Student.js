import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
      trim: true,
      minlength: [6, "Enter a valid phone number."],
      maxlength: [25, "Phone number is too long."],
    },
    department: {
      type: String,
      required: [true, "Department is required."],
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters."],
    },
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
