import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Smartphone, ShieldCheck, Users, ChevronLeft } from "lucide-react";
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

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 9) setStep("otp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    login(phone, role, name || undefined);
    navigate("/home");
  };

  const handleQuickLogin = (u) => {
    login(u.phone, u.role);
    navigate("/home");
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-white flex flex-col p-6">
        <button onClick={() => setStep("phone")} className="text-gray-400 hover:text-gray-600 mb-8 self-start transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 self-center ring-1 ring-primary/10">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">رمز التحقق</h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            أدخل رمز التحقق المرسل إلى <span className="font-semibold text-gray-700" dir="ltr">+967 {phone}</span>
          </p>
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input type="text" inputMode="numeric" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value)} placeholder="000000"
              className="w-full text-center text-2xl tracking-[0.5em] p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-all bg-gray-50/50" />
            <button type="submit" disabled={otp.length < 4}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100">
              تأكيد
            </button>
            <p className="text-center text-sm text-gray-400">
              لم يصلك رمز؟{" "}
              <button type="button" className="text-primary font-semibold hover:underline">إعادة إرسال</button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-primary/20">
            <span className="text-2xl font-black text-white">عت</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </h1>
          <p className="text-gray-400 text-sm">أدخل رقم جوالك واختر نوع الحساب</p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          {/* Name - always shown, optional for login */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full p-3.5 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 focus:bg-white" />
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الجوال</label>
            <div className="flex gap-2">
              <span className="flex items-center px-4 border-2 border-gray-200 rounded-2xl text-gray-500 bg-gray-50 text-sm font-medium">+967</span>
              <input type="tel" inputMode="numeric" value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                placeholder="777000000"
                className="flex-1 p-3.5 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 focus:bg-white" />
            </div>
          </div>

          {/* Role - ALWAYS shown for both login and register */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">نوع الحساب</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole("tenant")}
                className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                  role === "tenant"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}>
                <Smartphone className={`w-5 h-5 mx-auto mb-1 ${role === "tenant" ? "text-primary" : "text-gray-400"}`} />
                مستأجر
              </button>
              <button type="button" onClick={() => setRole("lessor")}
                className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                  role === "lessor"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}>
                <Smartphone className={`w-5 h-5 mx-auto mb-1 ${role === "lessor" ? "text-primary" : "text-gray-400"}`} />
                مؤجر
              </button>
            </div>
          </div>

          <button type="submit" disabled={phone.length < 9}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 mt-2">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-primary font-semibold hover:underline">
            {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </p>

        {/* Quick user switch for testing */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500">دخول سريع (للمعاينة)</p>
          </div>
          <div className="space-y-2">
            {allUsers.map(u => (
              <button key={u.id} type="button" onClick={() => handleQuickLogin(u)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100/80 hover:border-primary/20 hover:shadow-sm transition-all text-right bg-white">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400" dir="ltr">+967 {u.phone}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary flex-shrink-0">
                  {roleLabels[u.role] || u.role}
                </span>
                <ChevronLeft className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
