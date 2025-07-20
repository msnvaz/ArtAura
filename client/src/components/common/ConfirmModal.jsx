import React from "react";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
        <h2 className="text-xl font-bold text-[#7f5539] mb-2">{title}</h2>
        <p className="text-[#7f5539]/80 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-[#FFD95A] text-[#7f5539] bg-[#FFF5E1] hover:bg-[#FFD95A] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-[#D87C5A] text-white hover:bg-[#7f5539] transition-colors font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
