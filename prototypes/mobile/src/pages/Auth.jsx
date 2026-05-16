import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { ArrowRight, Smartphone, ShieldCheck, Loader, User, Building2, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };
const roleIcons = { tenant: User, lessor: Building2 };
const trialUsers = [
  { id: 1, name: "أحمد الحربي", phone: "555123456", role: "tenant" },
  { id: 2, name: "سارة القحطاني", phone: "555654321", role: "lessor" },
  { id: 3, name: "فهد الدوسري", phone: "555111222", role: "tenant" },
  { id: 4, name: "نورة الشمري", phone: "555333444", role: "lessor" },
];

export default function Auth() {
  const navigate = useNavigate();
  const { login, sendOtp, verifyOtp, loading } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("tenant");
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 6) return;
    if (mode === "register" && !name.trim()) {
      showToast("يرجى إدخال الاسم الكامل", "error");
      return;
    }
    try {
      await sendOtp(phone, role, mode === "register" ? name : undefined);
      setStep("otp");
    } catch (err) {
      showToast(err.message || "فشل إرسال رمز التحقق", "error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    try {
      const result = await verifyOtp(phone, otp, mode === "register" ? role : undefined);
      const targetRole = result?.role || role;
      if (mode === "register") {
        navigate(targetRole === "lessor" ? "/onboarding/lessor" : "/onboarding/tenant");
      } else {
        navigate(targetRole === "lessor" ? "/lessor-dashboard" : "/home");
      }
    } catch (err) {
      showToast(err.message || "رمز التحقق غير صحيح", "error");
    }
  };

  const handleQuickLogin = async (u) => {
    setPhone(u.phone);
    setRole(u.role);
    await login(u.phone, u.role, u.name);
    navigate(u.role === "lessor" ? "/lessor-dashboard" : "/home");
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
          <Logo className="w-36 mx-auto mb-3" variant="red" />
          <h1 className="text-xl font-bold text-gray-900">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </h1>
        </div>

        {mode === "login" ? (
          <>
            {/* Trial accounts - primary login method */}
            <div className="space-y-2 mb-5">
              <p className="text-xs text-gray-400 text-center mb-3">حسابات تجريبية للمعاينة</p>
              {trialUsers.map(u => {
                const Icon = roleIcons[u.role];
                return (
                  <button key={u.id} type="button" onClick={() => handleQuickLogin(u)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-100 hover:border-primary/30 hover:bg-primary/[0.02] transition-all text-right group shadow-sm">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                      u.role === "tenant" ? "bg-blue-50" : "bg-emerald-50"
                    } group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${u.role === "tenant" ? "text-blue-600" : "text-emerald-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900">{u.name}</p>
                      <p className="text-[11px] text-gray-400">{roleLabels[u.role]}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary text-white font-semibold shrink-0">
                      <LogIn className="w-3 h-3" /> دخول
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Phone login toggle */}
            <button onClick={() => setShowPhoneLogin(!showPhoneLogin)}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 py-2 hover:text-gray-600 transition-colors">
              <Smartphone className="w-3.5 h-3.5" />
              {showPhoneLogin ? "إخفاء تسجيل الدخول برقم الجوال" : "تسجيل الدخول برقم الجوال"}
            </button>

            {showPhoneLogin && (
              <form onSubmit={handleSendOtp} className="space-y-4 mt-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex gap-2">
                  <span className="flex items-center px-3 border-2 border-gray-200 rounded-xl text-gray-500 bg-white text-sm shrink-0">+966</span>
                  <input type="tel" inputMode="numeric" value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                    placeholder="500000000"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white" />
                </div>
                <button type="submit" disabled={phone.length < 6 || loading}
                  className="w-full bg-primary text-white font-bold py-2.5 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  تسجيل الدخول
                </button>
              </form>
            )}
          </>
        ) : (
          /* Register mode - with role selection, no trial accounts */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="الاسم الكامل"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-gray-50/50" />

            <div className="flex gap-2">
              <span className="flex items-center px-3 border-2 border-gray-200 rounded-xl text-gray-500 bg-gray-50 text-sm shrink-0">+966</span>
              <input type="tel" inputMode="numeric" value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder="500000000"
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

            <button type="submit" disabled={phone.length < 6 || loading}
              className="w-full bg-primary text-white font-bold py-3 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              إنشاء حساب
            </button>
          </form>
        )}

        <p className="text-center mt-5 text-sm text-gray-400">
          {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setRole("tenant"); setShowPhoneLogin(false); }}
            className="text-primary font-semibold">
            {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </p>
      </div>
    </div>
  );
}
