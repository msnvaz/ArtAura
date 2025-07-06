import React from "react";
import { Check, AlertTriangle } from "lucide-react";

const AlertMessage = ({ type = "success", message }) => {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg border ${
        isSuccess
          ? "bg-green-100 border-green-300 text-green-800"
          : "bg-red-100 border-red-300 text-red-800"
      }`}
    >
      {isSuccess ? (
        <Check className="h-5 w-5" />
      ) : (
        <AlertTriangle className="h-5 w-5" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
