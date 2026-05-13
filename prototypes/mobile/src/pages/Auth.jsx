import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Smartphone, ShieldCheck, Loader, User, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };
const roleIcons = { tenant: User, lessor: Building2 };

export default function Auth() {
  const navigate = useNavigate();
  const { login, sendOtp, verifyOtp, loading, allUsers } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("tenant");
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 9) return;
    try {
      await sendOtp(phone, role);
      setStep("otp");
    } catch (err) {
      showToast(err.message || "فشل إرسال رمز التحقق", "error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    try {
      await verifyOtp(phone, otp, name || undefined);
      if (mode === "register") {
        navigate(role === "lessor" ? "/onboarding/lessor" : "/onboarding/tenant");
      } else {
        navigate("/home");
      }
    } catch (err) {
      showToast(err.message || "رمز التحقق غير صحيح", "error");
    }
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
            <button type="submit" disabled={otp.length < 4 || loading}
              className="w-full bg-primary text-white font-bold py-3 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              تأكيد
            </button>
            <p className="text-center text-sm text-gray-400">
              لم يصلك رمز؟ <button type="button" onClick={handleSendOtp} className="text-primary font-semibold">إعادة إرسال</button>
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
            {["tenant", "lessor"].map(r => {
              const Icon = roleIcons[r];
              return (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    role === r ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${role === r ? "text-primary" : "text-gray-400"}`} />
                  {roleLabels[r]}
                </button>
              );
            })}
          </div>

          <button type="submit" disabled={phone.length < 9 || loading}
            className="w-full bg-primary text-white font-bold py-3 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading && <Loader className="w-4 h-4 animate-spin" />}
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

        {/* Demo accounts */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-3 text-center">حسابات تجريبية للمعاينة</p>
          <div className="space-y-2">
            {allUsers.filter(u => u.role !== "admin").map(u => {
              const Icon = roleIcons[u.role];
              return (
                <button key={u.id} type="button" onClick={() => handleQuickLogin(u)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100/80 hover:border-primary/20 hover:bg-primary/[0.02] transition-all text-right group shadow-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    u.role === "tenant" ? "bg-blue-50" : "bg-emerald-50"
                  } group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${u.role === "tenant" ? "text-blue-600" : "text-emerald-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900">{u.name}</p>
                    <p className="text-[11px] text-gray-400">{roleLabels[u.role]}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                    دخول
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
