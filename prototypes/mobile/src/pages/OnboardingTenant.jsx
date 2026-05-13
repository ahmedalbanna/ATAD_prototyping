import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CalendarDays, ClipboardList, Star } from "lucide-react";

const steps = [
  {
    title: "أهلاً بك كمستأجر",
    desc: "سنساعدك في خطوات بسيطة لاستئجار المعدات والأدوات التي تحتاجها",
    icon: Search,
  },
  {
    title: "تصفح الأصول",
    desc: "ابحث عن المعدات المتاحة في مدينتك، وصنفها حسب النوع والسعر",
    icon: Search,
  },
  {
    title: "اطلب التأجير",
    desc: "اختر تاريخ البداية والنهاية، وقدم طلب تأجير. المؤجر سيرد عليك قريباً",
    icon: CalendarDays,
  },
  {
    title: "تابع طلباتك",
    desc: "يمكنك متابعة حالة طلباتك والدفع والتقييم من صفحة طلباتي",
    icon: ClipboardList,
  },
  {
    title: "ابدأ الآن",
    desc: "أنت جاهز! تصفح الأصول المتاحة وابحث عن ما تحتاجه",
    icon: Star,
  },
];

export default function OnboardingTenant() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/home");
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full text-center">
        <div className={`w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-scale-in`}>
          <Icon className="w-12 h-12 text-primary" />
        </div>

        <div className="flex gap-1.5 justify-center mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-2 bg-gray-200"}`} />
          ))}
        </div>

        <div key={step} className="animate-slide-up">
          <h1 className="text-2xl font-black text-gray-900 mb-3">{current.title}</h1>
          <p className="text-gray-400 text-sm leading-relaxed">{current.desc}</p>
        </div>

        <button onClick={handleNext}
          className="w-full bg-primary text-white font-bold py-3 btn-pill hover:bg-primary-dark transition-all mt-8">
          {isLast ? "تصفح الأصول" : "التالي"}
        </button>

        {!isLast && (
          <button onClick={() => navigate("/home")}
            className="w-full text-gray-400 text-sm py-2 mt-2 hover:text-gray-600 transition-colors">
            تخطي
          </button>
        )}
      </div>
    </div>
  );
}
