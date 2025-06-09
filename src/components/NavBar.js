import React from "react";
// استيراد React لإنشاء مكون React

import { Link, useNavigate } from "react-router-dom";
// استيراد Link لإنشاء روابط تنقل داخل التطبيق بدون إعادة تحميل الصفحة
// واستيراد useNavigate لاستخدام التنقل برمجيًا (مثلاً بعد تسجيل الخروج)

import { useAuth } from "../context/AuthContext";
// استيراد هوك مخصص (useAuth) للحصول على بيانات المستخدم الحالي والدوال المتعلقة بالمصادقة

const NavBar = () => {
  // تعريف مكون NavBar كدالة (Functional Component)

  const { currentUser, role, logout } = useAuth();
  // جلب بيانات المستخدم الحالي (currentUser)، الدور (role) ودالة تسجيل الخروج (logout) من سياق المصادقة

  const navigate = useNavigate();
  // تهيئة دالة التنقل البرمجي

  const handleLogout = async () => {
    // دالة للتعامل مع زر تسجيل الخروج
    await logout();
    // استدعاء دالة تسجيل الخروج (تخرج المستخدم من النظام)
    navigate("/login");
    // إعادة التوجيه لصفحة تسجيل الدخول بعد تسجيل الخروج
  };

  return (
    <div className="navbar-container">
      {/* حاوية شاملة لشريط التنقل */}

      <nav className="navbar">
        {/* عنصر nav لاحتواء روابط التنقل */}

        <div className="nav-right">
          {/* جزء جهة اليمين (في تخطيط rtl يعني على اليمين) يحتوي روابط التنقل */}

          <Link to="/" className="nav-link">الطلاب</Link>
          {/* رابط للصفحة الرئيسية (قائمة الطلاب) */}

          {role !== "student" && (
            <Link to="/add" className="nav-link">إضافة طالب</Link>
          )}
          {/* إذا لم يكن الدور طالب، يعرض رابط إضافة طالب */}

          {role === "admin" && (
            <>
              {/* إذا كان الدور مدير يعرض هذه الروابط */}
              <Link to="/teachers" className="nav-link">قائمة الأساتذة</Link>
              {/* رابط لعرض قائمة الأساتذة */}
              <Link to="/add-teacher" className="nav-link">إضافة أستاذ</Link>
              {/* رابط لإضافة أستاذ جديد */}
              <Link to="/signup" className="nav-link">إنشاء حساب</Link>
              {/* رابط لإنشاء حساب جديد */}
            </>
          )}
        </div>

        {currentUser && (
          <div className="nav-left">
            {/* جزء جهة اليسار (في rtl على اليسار) يحتوي معلومات المستخدم وزر تسجيل الخروج */}
            <span className="user-role">
              أنت مسجل كـ: <strong>
                {role === "admin"
                  ? "مدير"
                  : role === "teacher"
                  ? "معلم"
                  : role === "student"
                  ? "طالب"
                  : "غير معروف"}
              </strong>
            </span>
            {/* عرض دور المستخدم الحالي كنص */}

            <button className="logout-btn" onClick={handleLogout}>تسجيل الخروج</button>
            {/* زر لتسجيل الخروج يستدعي دالة handleLogout عند الضغط */}
          </div>
        )}
      </nav>

      <style>
        {`
          /* تنسيقات CSS مضمّنة داخل المكون */

          .navbar-container {
            background: #1e293b; /* خلفية داكنة لشريط التنقل */
            padding: 12px 24px; /* حشوة داخلية */
            color: white; /* لون الخط أبيض */
            font-family: 'Segoe UI', Tahoma, sans-serif; /* نوع الخط */
            direction: rtl; /* اتجاه الكتابة من اليمين لليسار */
          }

          .navbar {
            display: flex; /* ترتيب العناصر أفقياً */
            justify-content: space-between; /* توزيع العناصر بين اليمين واليسار */
            align-items: center; /* محاذاة العناصر عمودياً في المنتصف */
            flex-wrap: wrap; /* السماح للصف بالانكسار عند الحاجة */
          }

          .nav-right, .nav-left {
            display: flex; /* ترتيب العناصر بداخلهم أفقيًا */
            align-items: center; /* محاذاة العناصر عمودياً */
            gap: 12px; /* مسافة بين كل رابط وزميله */
          }

          .nav-link {
            color: white; /* لون النص أبيض */
            text-decoration: none; /* إزالة التسطير الافتراضي للروابط */
            padding: 8px 14px; /* حشوة حول النص */
            border-radius: 6px; /* تدوير حواف الروابط */
            transition: background 0.3s; /* تأثير تحوّل سلس عند التفاعل */
          }

          .nav-link:hover {
            background: #334155; /* تغيير الخلفية عند مرور الماوس */
          }

          .user-role {
            margin-left: 10px; /* مسافة بين النص والزر على اليسار */
          }

          .logout-btn {
            background: #ef4444; /* خلفية حمراء لزر تسجيل الخروج */
            color: white; /* نص أبيض */
            border: none; /* إزالة الإطار الافتراضي */
            padding: 8px 14px; /* حشوة داخلية */
            border-radius: 6px; /* تدوير حواف الزر */
            cursor: pointer; /* تغير المؤشر عند المرور عليه */
            font-weight: bold; /* خط عريض */
            transition: background 0.3s, transform 0.2s; /* تأثيرات انتقاليّة */
          }

          .logout-btn:hover {
            background: #dc2626; /* لون أغمق عند التمرير */
            transform: scale(1.05); /* تكبير طفيف للزر */
          }
        `}
      </style>
    </div>
  );
};

export default NavBar;
// تصدير المكون لاستخدامه في أماكن أخرى داخل التطبيق
