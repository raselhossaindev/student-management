"use client";

import { Pencil, Trash2, Mail, Phone, Building2 } from "lucide-react";

export default function StudentCard({ student, onEdit, onDelete }) {
  return (
    <div className="group relative rounded-2xl bg-white p-5 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Gradient top bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl" />

      <div className="flex items-start gap-3 mt-1">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800 truncate">{student.name}</h3>
          <p className="text-xs text-gray-400 truncate">{student.department}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="h-4 w-4 text-indigo-500 shrink-0" />
          <span>{student.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="h-4 w-4 text-indigo-500 shrink-0" />
          <span>{student.department}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(student)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 text-amber-700 font-medium py-2 text-sm hover:bg-amber-100 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={() => onDelete(student._id)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-50 text-red-600 font-medium py-2 text-sm hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}