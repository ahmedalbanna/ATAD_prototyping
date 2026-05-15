import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-in text-center" onClick={e => e.stopPropagation()}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-50" : "bg-amber-50"}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? "text-red-500" : "text-amber-500"}`} />
        </div>
        {title && <h3 className="font-bold text-gray-900 mb-2">{title}</h3>}
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">
            {cancelLabel || "إلغاء"}
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all ${
              danger
                ? "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20"
                : "bg-primary hover:bg-primary-dark shadow-sm shadow-primary/20"
            }`}>
            {confirmLabel || "تأكيد"}
          </button>
        </div>
      </div>
    </div>
  );
}
