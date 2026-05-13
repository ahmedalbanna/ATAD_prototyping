import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/auth", { replace: true }), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-[#5a0a08] flex flex-col items-center justify-center text-white px-6">
      <div className="mb-6 drop-shadow-2xl">
        <Logo className="w-44" />
      </div>
      <p className="text-white/50 text-sm">منصة تأجير الأصول والمعدات</p>
      <div className="mt-16 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1.2s" }} />
        ))}
      </div>
    </div>
  );
}
