import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Upload, CheckCircle, Clock, AlertCircle, ArrowRight, ImagePlus, Camera, X, ChevronLeft, Loader } from "lucide-react";
import Layout from "../components/Layout";
import ImageCropper from "../components/ImageCropper";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/apiClient";

const BASE_URL = import.meta.env.VITE_API_URL || "http://185.190.140.93:3001/api/v1";
const API_HOST = BASE_URL.replace("/api/v1", "");

const STEPS = [
  { id: "start", label: "البداية" },
  { id: "id_front", label: "وجه الهوية" },
  { id: "id_back", label: "خلف الهوية" },
  { id: "submit", label: "مراجعة" },
];

async function uploadImage(file) {
  const imgData = new FormData();
  imgData.append("image", file);
  const token = api.getToken();
  const res = await fetch(`${API_HOST}/api/v1/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: imgData,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "فشل رفع الصورة");
  return `${API_HOST}${json.data.url}`;
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1 flex-1">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all ${
            i <= current ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-300"
          }`}>
            {i < current ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 rounded-full ${i < current ? "bg-primary" : "bg-gray-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ImageUploader({ label, hint, value, onChange, existing }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(existing || null);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const img = new Image();
    img.onload = async () => {
      if (img.naturalWidth < 400 || img.naturalHeight < 300) {
        setCropSrc(localUrl);
        return;
      }
      URL.revokeObjectURL(localUrl);
      setUploading(true);
      try {
        const url = await uploadImage(file);
        onChange(url);
      } catch {
        setPreview(null);
      } finally {
        setUploading(false);
      }
    };
    img.src = localUrl;
  };

  const handleCrop = async (cropped) => {
    setCropSrc(null);
    setUploading(true);
    try {
      const url = await uploadImage(cropped);
      onChange(url);
    } catch {
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const cancelCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setPreview(null);
    setCropSrc(null);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 bg-gray-50">
          <img src={preview} alt={label} className="w-full aspect-[4/3] object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Loader className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <button type="button" onClick={() => { setPreview(null); onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="absolute top-2 left-2 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> تم الرفع
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 hover:bg-primary/[0.02] transition-all flex flex-col items-center justify-center gap-2 active:scale-[0.99]">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
            <ImagePlus className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-gray-500">اضغط لرفع الصورة</span>
          {hint && <span className="text-[10px] text-gray-300">{hint}</span>}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" capture="environment"
        onChange={handleFile} className="hidden" />
      {cropSrc && (
        <ImageCropper imageSrc={cropSrc} onCrop={handleCrop} onCancel={cancelCrop} />
      )}
    </div>
  );
}

export default function Verification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, requestVerification, refreshUser, isVerified, isVerificationPending } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const wasRejected = searchParams.get("rejected") === "1";
  const [showRejectedBanner, setShowRejectedBanner] = useState(wasRejected);

  useEffect(() => { refreshUser(); }, []);

  if (isVerified) {
    return (
      <Layout title="توثيق الحساب" onBack={() => navigate(-1)}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-5">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">حسابك موثّق</h2>
          <p className="text-gray-400 text-sm mb-6">حسابك تم توثيقه بنجاح، يمكنك الآن استئجار الأصول</p>
          <button onClick={() => navigate("/home")}
            className="bg-primary text-white font-bold px-8 py-3 btn-pill transition-all hover:bg-primary-dark">
            العودة للرئيسية
          </button>
        </div>
      </Layout>
    );
  }

  if (isVerificationPending) {
    return (
      <Layout title="توثيق الحساب" onBack={() => navigate(-1)}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-5">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">طلب التوثيق قيد المراجعة</h2>
          <p className="text-gray-400 text-sm mb-2">طلبك قيد المراجعة من قبل فريق عتاد</p>
          <p className="text-gray-300 text-xs mb-6">سيتم إعلامك عند اكتمال التوثيق</p>
          <button onClick={() => navigate("/home")}
            className="bg-primary text-white font-bold px-8 py-3 btn-pill transition-all hover:bg-primary-dark">
            العودة للرئيسية
          </button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async () => {
    if (!idFront) {
      showToast("يرجى رفع صورة وجه الهوية", "error");
      return;
    }
    setSubmitting(true);
    try {
      const documents = [{ doc_type: "id_front", image_url: idFront }];
      if (idBack) documents.push({ doc_type: "id_back", image_url: idBack });

      await api.post("/users/me/verification", { documents });
      await refreshUser();
      showToast("تم تقديم طلب التوثيق بنجاح، سيتم مراجعة طلبك قريباً", "success");
    } catch (err) {
      showToast(err.message || "فشل تقديم الطلب", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="توثيق الحساب" onBack={() => navigate(-1)}>
      <StepIndicator current={step} />

      {step === 0 && (
        <div className="space-y-5 animate-scale-in">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 text-center border border-primary/10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">توثيق الحساب</h2>
            <p className="text-gray-400 text-sm">لتوثيق حسابك، يرجى رفع صور الهوية الوطنية للتأكد من هويتك</p>
          </div>

          {showRejectedBanner && (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200/50 animate-scale-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-800">تم رفض طلب التوثيق السابق</p>
                  <p className="text-xs text-red-600 mt-1">يمكنك إعادة تقديم الطلب مع صور جديدة ومطابقة للشروط</p>
                </div>
                <button type="button" onClick={() => setShowRejectedBanner(false)}
                  className="shrink-0 text-red-400 hover:text-red-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100/80 p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 mb-4">خطوات التوثيق</h3>
            <div className="space-y-4">
              {[
                { step: "1", text: "صورة وجه الهوية الوطنية (إلزامي)" },
                { step: "2", text: "صورة خلف الهوية الوطنية (اختياري)" },
                { step: "3", text: "مراجعة وإرسال الطلب" },
              ].map(({ step: s, text }) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-primary">{s}</span>
                  </div>
                  <span className="text-xs text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                سيتم استخدام صور الهوية لغرض التوثيق فقط ولن يتم مشاركتها مع أي طرف آخر.
              </p>
            </div>
          </div>

          <button onClick={() => setStep(1)}
            className="w-full bg-primary text-white font-bold py-4 btn-pill transition-all hover:bg-primary-dark flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <Camera className="w-5 h-5" /> ابدأ التوثيق
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5 animate-scale-in">
          <div className="bg-white rounded-2xl border border-gray-100/80 p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 mb-1">صورة وجه الهوية</h3>
            <p className="text-xs text-gray-400 mb-4">يرجى تصوير وجه الهوية الوطنية بوضوح</p>
            <ImageUploader
              label="الوجه الأمامي للهوية"
              hint="JPG أو PNG، حد أدنى 400×300"
              value={idFront}
              onChange={setIdFront}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)}
              className="flex-1 text-gray-400 font-semibold text-sm py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
              السابق
            </button>
            <button onClick={() => setStep(2)} disabled={!idFront}
              className="flex-1 bg-primary text-white font-bold py-3 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              التالي <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5 animate-scale-in">
          <div className="bg-white rounded-2xl border border-gray-100/80 p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 mb-1">صورة خلف الهوية</h3>
            <p className="text-xs text-gray-400 mb-4">اختياري — يفضل رفعها لتسريع عملية التوثيق</p>
            <ImageUploader
              label="الوجه الخلفي للهوية"
              hint="اختياري"
              value={idBack}
              onChange={setIdBack}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 text-gray-400 font-semibold text-sm py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
              السابق
            </button>
            <button onClick={() => setStep(3)}
              className="flex-1 bg-primary text-white font-bold py-3 btn-pill transition-all hover:bg-primary-dark flex items-center justify-center gap-2">
              مراجعة الطلب <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5 animate-scale-in">
          <div className="bg-white rounded-2xl border border-gray-100/80 p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 mb-4">مراجعة طلب التوثيق</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1.5">الاسم</p>
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5">رقم الجوال</p>
                <p className="text-sm font-bold text-gray-900" dir="ltr">{user?.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {idFront && (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">وجه الهوية</p>
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img src={idFront} alt="وجه الهوية" className="w-full aspect-[4/3] object-cover" />
                    </div>
                  </div>
                )}
                {idBack && (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">خلف الهوية</p>
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img src={idBack} alt="خلف الهوية" className="w-full aspect-[4/3] object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                بالضغط على "إرسال الطلب"، أنت توافق على استخدام بيانات هويتك لغرض التوثيق في منصة عتاد.
              </p>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting || !idFront}
            className="w-full bg-primary text-white font-bold py-4 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            {submitting ? (
              <span className="flex items-center gap-2"><Loader className="w-5 h-5 animate-spin" /> جاري الإرسال...</span>
            ) : (
              <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> إرسال طلب التوثيق</span>
            )}
          </button>

          <button onClick={() => setStep(2)}
            className="w-full text-gray-400 font-semibold text-sm py-3 hover:text-gray-600 transition-colors">
            تعديل الصور
          </button>
        </div>
      )}
    </Layout>
  );
}
