import React, { useState } from 'react'; // استيراد React و useState لإدارة الحالة داخل المكون
import { useNavigate } from 'react-router-dom'; // استيراد هوك التنقل بين الصفحات
import { signInWithEmailAndPassword } from 'firebase/auth'; // استيراد دالة تسجيل الدخول بالبريد وكلمة المرور من Firebase
import { auth } from '../firebase'; // استيراد كائن المصادقة من ملف إعداد Firebase
import { signInWithPopup } from 'firebase/auth'; // استيراد دالة تسجيل الدخول عبر نافذة منبثقة (Google)
import { provider, db } from '../firebase'; // استيراد مزود Google و قاعدة بيانات Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore'; // استيراد دوال قراءة وكتابة مستندات Firestore

const Login = () => {
  const navigate = useNavigate(); // تهيئة دالة التنقل برمجياً بين صفحات التطبيق

  const [email, setEmail] = useState(''); // حالة لتخزين البريد الإلكتروني المدخل من المستخدم (مبدئياً فارغ)
  const [password, setPassword] = useState(''); // حالة لتخزين كلمة المرور المدخلة (مبدئياً فارغ)
  const [error, setError] = useState(''); // حالة لتخزين رسالة الخطأ إذا حدثت مشكلة في تسجيل الدخول

  // دالة تنفيذية لمعالجة تسجيل الدخول بالبريد وكلمة المرور
  const handleLogin = async (e) => {
    e.preventDefault(); // منع تحديث الصفحة الافتراضي عند تقديم النموذج
    try {
      await signInWithEmailAndPassword(auth, email, password); // محاولة تسجيل الدخول باستخدام Firebase
      navigate('/'); // عند النجاح، التوجه إلى الصفحة الرئيسية
    } catch (err) {
      setError('بيانات الدخول غير صحيحة'); // عند الفشل، عرض رسالة خطأ
    }
  };

  // دالة تسجيل الدخول باستخدام حساب Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // فتح نافذة منبثقة لتسجيل الدخول عبر Google
      const user = result.user; // الحصول على بيانات المستخدم المسجل

      const userRef = doc(db, "users", user.uid); // إنشاء مرجع للمستخدم في مجموعة "users" في Firestore
      const userSnap = await getDoc(userRef); // قراءة مستند المستخدم من Firestore

      if (!userSnap.exists()) {
        // إذا المستخدم جديد ولم يكن موجود في قاعدة البيانات
        await setDoc(userRef, {
          name: user.displayName, // تخزين اسم المستخدم
          email: user.email,       // تخزين البريد الإلكتروني
          role: "teacher"          // إعطاء الدور "معلم" بشكل افتراضي
        });
      }

      navigate("/"); // التنقل للصفحة الرئيسية بعد تسجيل الدخول
    } catch (err) {
      console.error("خطأ في تسجيل الدخول بـ Google:", err); // تسجيل الخطأ في الكونسول
      setError("حدث خطأ أثناء تسجيل الدخول بـ Google"); // عرض رسالة خطأ للمستخدم
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>تسجيل الدخول</h2>
        {error && <p className="error">{error}</p>} {/* عرض رسالة الخطأ إذا كانت موجودة */}

        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          value={email} // ربط قيمة الحقل بحالة email
          onChange={(e) => setEmail(e.target.value)} // تحديث الحالة عند تغيير النص
          required // الحقل مطلوب
        />

        <label>كلمة المرور:</label>
        <input
          type="password"
          value={password} // ربط قيمة الحقل بحالة password
          onChange={(e) => setPassword(e.target.value)} // تحديث الحالة عند تغيير النص
          required // الحقل مطلوب
        />

        <button type="submit">تسجيل الدخول</button> {/* زر إرسال النموذج */}

        <p className="signup-link">
          ليس لديك حساب؟{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')} // زر للتوجه إلى صفحة التسجيل
          >
            أنشئ حساب الآن
          </button>
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin} // زر لتسجيل الدخول عبر Google
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            backgroundColor: "#ea4335",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          تسجيل الدخول باستخدام Google
        </button>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/')} // زر للعودة إلى الصفحة الرئيسية بدون تسجيل دخول
        >
          الرجوع إلى القائمة الرئيسية
        </button>
      </form>

      {/* تنسيقات CSS مدمجة داخل المكون */}
      <style>{`
        .login-container {
          direction: rtl; /* النص من اليمين لليسار */
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #f1f5f9;
          min-height: 100vh; /* ارتفاع الصفحة كامل */
          display: flex;
          justify-content: center; /* توسيط أفقي */
          align-items: center; /* توسيط عمودي */
        }

        .login-form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }

        .login-form h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .login-form label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-weight: 500;
        }

        .login-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s;
        }

        .login-form input:focus {
          border-color: #3b82f6;
          outline: none;
        }

        .login-form button {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          background-color: #2563eb;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }

        .login-form .back-button {
          background-color: #64748b;
        }

        .login-form button:hover {
          background-color: #1e40af;
        }

        .login-form .back-button:hover {
          background-color: #475569;
        }

        .signup-link {
          margin-top: 20px;
          text-align: center;
        }

        .signup-link button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          text-decoration: underline;
          font-size: 1em;
        }

        .signup-link button:hover {
          color: #1d4ed8;
        }

        .error {
          color: red;
          margin-bottom: 15px;
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Login; // تصدير المكون لاستخدامه في التطبيق
