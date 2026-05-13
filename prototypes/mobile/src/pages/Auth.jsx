import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Smartphone, ShieldCheck, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };

export default function Auth() {
  const navigate = useNavigate();
  const { login, allUsers } = useAuth();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("tenant");

  const handleSendOtp = (e) => { e.preventDefault(); if (phone.length >= 9) setStep("otp"); };
  const handleVerifyOtp = (e) => { e.preventDefault(); login(phone, role, name || undefined); navigate("/home"); };
  const handleQuickLogin = (u) => { login(u.phone, u.role); navigate("/home"); };

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-white flex flex-col p-6">
        <button onClick={() => setStep("phone")} className="text-gray-400 hover:text-gray-600 mb-8 self-start transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 self-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">رمز التحقق</h1>
          <p className="text-gray-400 text-sm text-center mb-6">
            أدخل الرقم المرسل إلى <span className="font-semibold text-gray-700" dir="ltr">+966 {phone}</span>
          </p>
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <input type="text" inputMode="numeric" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-2xl tracking-[0.5em] p-3.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-gray-50/50" />
            <button type="submit" disabled={otp.length < 4}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed">
              تأكيد
            </button>
            <p className="text-center text-sm text-gray-400">
              لم يصلك رمز؟ <button type="button" className="text-primary font-semibold">إعادة إرسال</button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg shadow-primary/20">
            <span className="text-xl font-black text-white">عت</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </h1>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === "register" && (
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="الاسم الكامل"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-gray-50/50" />
          )}

          <div className="flex gap-2">
            <span className="flex items-center px-3 border-2 border-gray-200 rounded-xl text-gray-500 bg-gray-50 text-sm shrink-0">+966</span>
            <input type="tel" inputMode="numeric" value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="777000000"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-gray-50/50" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {["tenant", "lessor"].map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                  role === r ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500"
                }`}>
                <Smartphone className={`w-4 h-4 mx-auto mb-1 ${role === r ? "text-primary" : "text-gray-400"}`} />
                {r === "tenant" ? "مستأجر" : "مؤجر"}
              </button>
            ))}
          </div>

          <button type="submit" disabled={phone.length < 9}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setRole("tenant"); }}
            className="text-primary font-semibold">
            {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </p>

        {/* Quick users */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 text-center">دخول سريع للمعاينة</p>
          <div className="flex justify-center gap-2">
            {allUsers.map(u => (
              <button key={u.id} type="button" onClick={() => handleQuickLogin(u)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200/80 text-xs hover:border-primary/30 hover:text-primary transition-colors bg-white">
                <span className="font-bold">{u.name}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400">{roleLabels[u.role]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
