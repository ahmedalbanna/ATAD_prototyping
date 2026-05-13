import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Smartphone, ShieldCheck } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("tenant");

  const handleSendOtp = (e) => { e.preventDefault(); if (phone.length >= 9) setStep("otp"); };
  const handleVerifyOtp = (e) => { e.preventDefault(); navigate("/home"); };

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
          <p className="text-gray-400 text-sm">أدخل رقم جوالك للبدء</p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full p-3.5 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 focus:bg-white" />
            </div>
          )}

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

          {mode === "register" && (
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
          )}

          <button type="submit" disabled={phone.length < 9}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 mt-2">
            إرسال رمز التحقق
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-primary font-semibold hover:underline">
            {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </p>
      </div>
    </div>
  );
}
