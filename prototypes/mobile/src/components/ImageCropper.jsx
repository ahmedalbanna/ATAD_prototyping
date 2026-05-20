import { useState, useRef, useEffect, useCallback } from "react";
import { Check, X } from "lucide-react";

export default function ImageCropper({ imageSrc, onCrop, onCancel }) {
  const [img, setImg] = useState(null);
  const containerRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const displayRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!img || !containerRef.current) return;
    const cw = containerRef.current.getBoundingClientRect().width;
    const dw = cw;
    const dh = dw * (img.naturalHeight / img.naturalWidth);
    displayRef.current = { w: dw, h: dh };

    const ratio = 4 / 3;
    let cw2, ch2;
    if (dw / dh > ratio) {
      ch2 = dh;
      cw2 = ch2 * ratio;
    } else {
      cw2 = dw;
      ch2 = cw2 / ratio;
    }
    setCrop({ x: (dw - cw2) / 2, y: (dh - ch2) / 2, w: cw2, h: ch2 });
  }, [img]);

  const handlePointerDown = useCallback((e) => {
    if (!crop) return;
    const clX = e.clientX ?? e.touches[0].clientX;
    const clY = e.clientY ?? e.touches[0].clientY;
    const origCrop = { ...crop };

    function onMove(ev) {
      const cx = ev.clientX ?? ev.touches[0].clientX;
      const cy = ev.clientY ?? ev.touches[0].clientY;
      const dx = cx - clX;
      const dy = cy - clY;
      const { w: dw, h: dh } = displayRef.current;
      setCrop({
        ...origCrop,
        x: Math.max(0, Math.min(origCrop.x + dx, dw - origCrop.w)),
        y: Math.max(0, Math.min(origCrop.y + dy, dh - origCrop.h)),
      });
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    }

    if (e.type === "touchstart") {
      document.addEventListener("touchmove", onMove, { passive: true });
      document.addEventListener("touchend", onUp, { passive: true });
    } else {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
  }, [crop]);

  const doCrop = useCallback(() => {
    if (!img || !crop) return;
    const scale = img.naturalWidth / displayRef.current.w;
    const ox = crop.x * scale;
    const oy = crop.y * scale;
    const ow = crop.w * scale;
    const oh = crop.h * scale;
    const outW = Math.max(Math.round(ow), 400);
    const outH = Math.max(Math.round(oh), 300);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, ox, oy, ow, oh, 0, 0, outW, outH);
    canvas.toBlob(b => {
      if (b) onCrop(new File([b], "cropped.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", 0.92);
  }, [img, crop, onCrop]);

  if (!img) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const dh = displayRef.current.h || 300;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-sm">قص الصورة</h3>
          <button type="button" onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-3">اسحب لتحديد الجزء المطلوب من الصورة</p>
          <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-black select-none" style={{ height: dh }}>
            <img src={imageSrc} className="block w-full pointer-events-none" draggable={false} alt="صورة" />
            {crop && (
              <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
                <div
                  style={{
                    position: "absolute", left: crop.x, top: crop.y,
                    width: crop.w, height: crop.h,
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                    border: "2px solid #fff",
                    cursor: "grab",
                    pointerEvents: "auto",
                  }}
                  onMouseDown={handlePointerDown}
                  onTouchStart={handlePointerDown}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-4 border-t border-gray-100">
          <button type="button" onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
          <button type="button" onClick={doCrop}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
            <Check className="w-4 h-4" /> تطبيق
          </button>
        </div>
      </div>
    </div>
  );
}
