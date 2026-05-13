import { useNavigate } from "react-router-dom";
import { FileText, Check } from "lucide-react";
import Layout from "../components/Layout";

const sections = [
  {
    title: "مقدمة",
    content: "مرحباً بك في منصة عتاد. باستخدامك لهذه المنصة، فإنك توافق على الشروط والأحكام التالية. يرجى قراءتها بعناية قبل استخدام الخدمة.",
  },
  {
    title: "تعريفات",
    content: "المنصة: موقع عتاد الإلكتروني. المؤجر: الشخص الذي يعرض أصولاً للتأجير. المستأجر: الشخص الذي يستأجر أصلاً. الأصل: المعدات أو الأداة المعروضة للتأجير.",
  },
  {
    title: "التسجيل والحساب",
    content: "يجب على المستخدم إنشاء حساب للاستفادة من خدمات المنصة. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يجب أن تكون جميع المعلومات المقدمة دقيقة وكاملة.",
  },
  {
    title: "التأجير",
    content: "عند تقديم طلب تأجير، يلتزم المستأجر بدفع المبلغ المتفق عليه كاملاً. المؤجر لديه الحق في قبول أو رفض أي طلب تأجير. مدة التأجير تبدأ من تاريخ الاستلام المتفق عليه.",
  },
  {
    title: "المسؤولية",
    content: "المستأجر مسؤول عن أي تلفيات أو أضرار تحدث للأصل خلال فترة التأجير. يجب إعادة الأصل بنفس الحالة التي تم استلامه بها. قد يتم احتجاز المبلغ المدفوع كتعويض عن الأضرار.",
  },
  {
    title: "المدفوعات",
    content: "يتم دفع قيمة التأجير بالكامل قبل استلام الأصل. جميع المدفوعات غير قابلة للاسترداد إلا في الحالات التي تحددها سياسة الاسترداد الخاصة بالمنصة.",
  },
  {
    title: "إلغاء الحجز",
    content: "يمكن إلغاء الحجز قبل بدء فترة التأجير وفقاً لسياسة الإلغاء المتبعة. قد يتم تطبيق رسوم إلغاء حسب الحالة.",
  },
  {
    title: "خصوصية البيانات",
    content: "نحن نلتزم بحماية خصوصية بياناتك الشخصية. يتم جمع البيانات واستخدامها وفقاً لسياسة الخصوصية الخاصة بنا.",
  },
  {
    title: "تعديل الشروط",
    content: "تحتفظ المنصة بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بالتغييرات الجوهرية عبر البريد الإلكتروني أو الإشعارات.",
  },
];

export default function Terms() {
  const navigate = useNavigate();

  return (
    <Layout title="الشروط والأحكام" onBack={() => navigate(-1)}>
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">الشروط والأحكام</h1>
            <p className="text-xs text-gray-400">آخر تحديث: 13 مايو 2026</p>
          </div>
        </div>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">{i + 1}</span>
                {s.title}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed mr-7">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" className="mt-0.5 accent-primary w-4 h-4 rounded border-gray-300" />
            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors leading-relaxed">
              أقر بأنني قد قرأت الشروط والأحكام وأوافق عليها بالكامل.
            </span>
          </label>
        </div>
      </div>
    </Layout>
  );
}
