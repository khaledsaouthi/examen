import React, { useState } from 'react';
// استيراد React و useState لإدارة حالة المكون

import { createUserWithEmailAndPassword } from 'firebase/auth';
// استيراد دالة لإنشاء مستخدم جديد بواسطة البريد وكلمة المرور من Firebase Authentication

import { auth, db } from '../firebase';
// استيراد كائنات المصادقة وقاعدة البيانات من ملف إعداد Firebase

import { doc, setDoc } from 'firebase/firestore';
// استيراد دوال لإنشاء وتعديل مستندات في Firestore

import { useNavigate } from 'react-router-dom';
// استيراد هوك للتنقل بين صفحات التطبيق

const Signup = () => {
  const navigate = useNavigate();
  // إنشاء دالة تنقل بين الصفحات

  const [email, setEmail] = useState('');
  // حالة لتخزين البريد الإلكتروني المُدخل، ابتدائياً فارغ

  const [password, setPassword] = useState('');
  // حالة لتخزين كلمة المرور المُدخلة، ابتدائياً فارغ

  const [role, setRole] = useState('student');
  // حالة لتخزين نوع الحساب (دور المستخدم)، القيمة الابتدائية "طالب"

  const [error, setError] = useState('');
  // حالة لتخزين رسالة الخطأ إن وجدت

  const handleSignup = async (e) => {
    e.preventDefault();
    // منع إعادة تحميل الصفحة عند إرسال النموذج

    setError('');
    // مسح أي رسالة خطأ سابقة

    const allowedRoles = ['student', 'teacher'];
    // قائمة الأدوار المسموح بها

    const selectedRole = allowedRoles.includes(role) ? role : 'student';
    // التحقق من صحة الدور المحدد، إذا غير موجود يتم افتراض "طالب"

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // إنشاء حساب جديد في Firebase Authentication باستخدام البريد وكلمة المرور

      const user = userCredential.user;
      // استخراج بيانات المستخدم الجديد

      await setDoc(doc(db, 'users', user.uid), {
        email,
        role: selectedRole
      });
      // إنشاء مستند في مجموعة "users" في Firestore يحمل uid المستخدم ويتضمن البريد والدور

      navigate('/');
      // التنقل إلى الصفحة الرئيسية بعد نجاح التسجيل
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب: ' + err.message);
      // في حالة حدوث خطأ، حفظ رسالة الخطأ لعرضها للمستخدم
    }
  };

  return (
    <div className="signup-container">
      {/* حاوية النموذج مع تنسيق */}
      <form onSubmit={handleSignup} className="signup-form">
        {/* نموذج التسجيل مع استدعاء الدالة handleSignup عند الإرسال */}
        <h2>إنشاء حساب</h2>
        {/* عنوان النموذج */}

        {error && <p className="error">{error}</p>}
        {/* عرض رسالة الخطأ إذا كانت موجودة */}

        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* حقل لإدخال البريد، مرتبط بحالة email */}

        <label>كلمة المرور:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* حقل لإدخال كلمة المرور، مرتبط بحالة password */}

        <label>نوع الحساب:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">طالب</option>
          <option value="teacher">معلم</option>
        </select>
        {/* قائمة منسدلة لاختيار الدور (طالب أو معلم)، مرتبطة بحالة role */}

        <button type="submit">تسجيل</button>
        {/* زر لإرسال النموذج */}

        <button
          type="button"
          onClick={() => navigate('/')}
          className="back-button"
        >
          الرجوع إلى القائمة الرئيسية
        </button>
        {/* زر للرجوع للصفحة الرئيسية بدون إرسال النموذج */}
      </form>

      <style>{`
        /* تنسيقات CSS داخلية للمكون */
        .signup-container {
          direction: rtl; /* اتجاه النص من اليمين لليسار */
          font-family: 'Segoe UI', Tahoma, sans-serif; /* نوع الخط */
          background-color: #f8fafc; /* خلفية فاتحة */
          min-height: 100vh; /* ارتفاع كامل الشاشة */
          display: flex;
          justify-content: center; /* توسيط أفقي */
          align-items: center; /* توسيط عمودي */
        }

        .signup-form {
          width: 100%;
          max-width: 400px; /* الحد الأقصى للعرض */
          background: white; /* خلفية بيضاء */
          padding: 30px; /* حشوة داخلية */
          border-radius: 12px; /* زوايا مدورة */
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); /* ظل */
        }

        .signup-form h2 {
          text-align: center; /* توسيط النص */
          margin-bottom: 20px; /* مسافة تحت العنوان */
          color: #1e293b; /* لون النص */
        }

        .signup-form label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-weight: 500;
        }

        .signup-form input,
        .signup-form select {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s;
        }

        .signup-form input:focus,
        .signup-form select:focus {
          border-color: #3b82f6; /* لون الإطار عند التركيز */
          outline: none;
        }

        .signup-form button {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          background-color: #2563eb; /* لون الخلفية الأزرق */
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }

        .signup-form .back-button {
          background-color: #64748b; /* لون الخلفية للزر الرجوع */
        }

        .signup-form button:hover {
          background-color: #1e40af; /* لون الخلفية عند المرور على الزر */
        }

        .signup-form .back-button:hover {
          background-color: #475569;
        }

        .error {
          color: red;
          margin-bottom: 15px;
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Signup;
// تصدير المكون للاستخدام في أماكن أخرى
