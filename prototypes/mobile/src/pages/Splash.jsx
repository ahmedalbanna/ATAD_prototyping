import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/auth", { replace: true }), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-[oklch(0.2_0.12_28)] flex flex-col items-center justify-center text-white px-6">
      <div className="relative mb-8">
        <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl ring-1 ring-white/20">
          <span className="text-5xl font-black tracking-tight">عتاد</span>
        </div>
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      </div>
      <h1 className="text-4xl font-black tracking-tight mb-2">عتاد</h1>
      <p className="text-white/60 text-sm font-medium tracking-wide">منصة تأجير الأصول والمعدات</p>
      <div className="mt-16 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i}
            className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1.2s" }}
          />
        ))}
      </div>
    </div>
  );
}
