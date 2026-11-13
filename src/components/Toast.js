"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export default function Toast({ type = "success", message, onClose }) {
  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-600",
      text: "text-emerald-800",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      text: "text-red-800",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      text: "text-blue-800",
    },
  };

  const { icon: Icon, bg, iconColor, text } = config[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border ${bg} px-5 py-3.5 shadow-2xl animate-slide-in-right backdrop-blur-sm max-w-sm`}
    >
      <Icon className={`h-5 w-5 ${iconColor} shrink-0`} />
      <p className={`text-sm font-medium ${text} flex-1`}>{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}