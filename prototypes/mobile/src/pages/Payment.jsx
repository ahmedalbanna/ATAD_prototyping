import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, Banknote, CheckCircle, AlertCircle, Upload, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import { bookings } from "../data/mock";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find(b => b.id === Number(id));
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState("select");
  const [receipt, setReceipt] = useState(null);

  if (!booking) {
    return (
      <Layout title="غير موجود" onBack={() => navigate(-1)}>
        <div className="text-center py-20 text-gray-300">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-gray-400">الحجز غير موجود</p>
        </div>
      </Layout>
    );
  }

  const handlePay = () => {
    setStep("success");
    setTimeout(() => navigate("/bookings", { replace: true }), 2500);
  };

  if (step === "success") {
    return (
      <Layout title="الدفع" onBack={() => navigate(-1)}>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">تم الدفع بنجاح!</h2>
          <p className="text-gray-400 text-sm">سيتم تحويلك إلى قائمة الطلبات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="إتمام الدفع" onBack={() => navigate(-1)}>
      {/* Booking summary */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <img src={booking.assetImage} alt={booking.assetTitle}
            className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0 ring-1 ring-gray-100" />
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 truncate">{booking.assetTitle}</p>
            <p className="text-xs text-gray-400 mt-0.5">{booking.startDate} → {booking.endDate}</p>
            <p className="text-primary font-bold text-sm mt-1">{booking.totalPrice} ﷼</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mock payment */}
        <button onClick={() => setMethod("mock")}
          className={`w-full bg-white rounded-2xl p-4 border-2 text-right transition-all ${
            method === "mock" ? "border-primary bg-primary/[0.03]" : "border-gray-100/80 hover:border-gray-200"
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              method === "mock" ? "bg-primary/10" : "bg-gray-50"
            }`}>
              <CreditCard className={`w-5 h-5 ${method === "mock" ? "text-primary" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">دفع تجريبي (Mock)</p>
              <p className="text-xs text-gray-400">محاكاة عملية دفع - للمعاينة فقط</p>
            </div>
            {method === "mock" && (
              <div className="mr-auto">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            )}
          </div>
        </button>

        {/* Bank transfer */}
        <button onClick={() => setMethod("bank")}
          className={`w-full bg-white rounded-2xl p-4 border-2 text-right transition-all ${
            method === "bank" ? "border-primary bg-primary/[0.03]" : "border-gray-100/80 hover:border-gray-200"
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              method === "bank" ? "bg-primary/10" : "bg-gray-50"
            }`}>
              <Banknote className={`w-5 h-5 ${method === "bank" ? "text-primary" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">تحويل بنكي</p>
              <p className="text-xs text-gray-400">حول المبلغ وارفع إيصال الدفع</p>
            </div>
            {method === "bank" && (
              <div className="mr-auto">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            )}
          </div>
        </button>

        {/* Bank details */}
        {method === "bank" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-gray-900">بيانات الحساب البنكي</h4>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
              <p className="text-gray-500">البنك: <span className="font-semibold text-gray-900">البنك التجاري</span></p>
              <p className="text-gray-500">رقم الحساب: <span className="font-semibold text-gray-900" dir="ltr">YE12 3456 7890 1234 5678</span></p>
              <p className="text-gray-500">المبلغ: <span className="font-semibold text-primary">{booking.totalPrice} ﷼</span></p>
              <p className="text-gray-500">الاسم: <span className="font-semibold text-gray-900">شركة عتاد للتأجير</span></p>
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1.5 block">ارفع إيصال الدفع</span>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 cursor-pointer hover:border-primary/40 transition-all">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs">اضغط لرفع صورة الإيصال</p>
              </div>
            </label>
          </div>
        )}

        <button onClick={handlePay} disabled={!method}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
          {method === "mock" ? (
            <>تأكيد الدفع التجريبي <ArrowRight className="w-4 h-4" /></>
          ) : method === "bank" ? (
            <>إرسال الإيصال للمراجعة <ArrowRight className="w-4 h-4" /></>
          ) : (
            <>اختر طريقة الدفع</>
          )}
        </button>
      </div>
    </Layout>
  );
}
