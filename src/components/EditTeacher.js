import React, { useEffect, useState } from 'react'; // استيراد React مع هوك useEffect لإدارة تأثيرات جانبية و useState لإدارة الحالة
import { useParams, useNavigate } from 'react-router-dom'; // استيراد هوكات لاستخدام معرّف المعلم والتنقل بين الصفحات
import { db } from '../firebase'; // استيراد قاعدة بيانات Firestore من ملف الإعدادات
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // استيراد دوال التعامل مع مستندات Firestore: قراءة وتحديث

const EditTeacher = () => {
  const { id } = useParams(); // الحصول على معرّف المعلم من رابط الصفحة (مثل /edit-teacher/:id)
  const navigate = useNavigate(); // تهيئة دالة التنقل برمجياً بين الصفحات

  // حالة لتخزين بيانات المعلم وتحديثها
  const [teacher, setTeacher] = useState({
    firstName: '',    // الاسم الأول
    lastName: '',     // اللقب
    age: '',          // العمر
    hireDate: '',     // تاريخ التوظيف
    specialty: '',    // التخصص
    teachingYear: '', // سنة التدريس
  });

  const [loading, setLoading] = useState(true); // حالة لتحديد ما إذا كانت البيانات قيد التحميل

  // تأثير جانبي لجلب بيانات المعلم من Firestore عند تحميل الصفحة أو تغير المعرف
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const docRef = doc(db, 'teachers', id); // تحديد مستند المعلم باستخدام معرفه
        const docSnap = await getDoc(docRef);   // جلب بيانات المستند من Firestore
        if (docSnap.exists()) {
          setTeacher(docSnap.data()); // إذا وجد المستند، تحديث الحالة ببيانات المعلم
        } else {
          alert('الأستاذ غير موجود'); // إذا لم يكن موجودًا، إعلام المستخدم
          navigate('/'); // الرجوع للصفحة الرئيسية
        }
      } catch (error) {
        alert('حدث خطأ أثناء جلب البيانات'); // عند حدوث خطأ أثناء الجلب
      } finally {
        setLoading(false); // إنهاء حالة التحميل سواء نجح أو فشل الجلب
      }
    };
    fetchTeacher(); // استدعاء دالة الجلب
  }, [id, navigate]); // إعادة التنفيذ إذا تغير معرف المعلم أو دالة التنقل

  // دالة لمعالجة تغييرات المستخدم في الحقول وتحديث الحالة
  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value }); 
    // نسخ الحالة القديمة مع تعديل الحقل الذي تم تغييره بناءً على اسم الحقل
  };

  // دالة معالجة إرسال النموذج لتحديث بيانات المعلم في Firestore
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع تحديث الصفحة الافتراضي عند إرسال النموذج
    try {
      const docRef = doc(db, 'teachers', id); // تحديد مستند المعلم
      await updateDoc(docRef, teacher);       // تحديث بيانات المستند بالقيم الجديدة
      alert('تم تعديل بيانات الأستاذ بنجاح'); // إعلام المستخدم بالنجاح
      navigate(`/teacher/${id}`);             // الانتقال لصفحة عرض بيانات المعلم المعدلة
    } catch (error) {
      alert('حدث خطأ أثناء حفظ التغييرات'); // إعلام المستخدم إذا حدث خطأ
    }
  };

  // عرض رسالة تحميل أثناء جلب البيانات
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>⏳ جاري التحميل...</p>;
  }

  return (
    <div className="form-container">
      <h2>تعديل بيانات الأستاذ</h2>
      <form onSubmit={handleSubmit}>
        {/* حقل الاسم الأول */}
        <input
          type="text"
          name="firstName"               // اسم الحقل لتعريفه في حالة teacher
          value={teacher.firstName}      // ربط القيمة بالحالة
          onChange={handleChange}        // تحديث الحالة عند التغيير
          placeholder="الاسم"             // نص إرشادي داخل الحقل
          required                      // جعل الحقل مطلوبًا
        />
        {/* حقل اللقب */}
        <input
          type="text"
          name="lastName"
          value={teacher.lastName}
          onChange={handleChange}
          placeholder="اللقب"
          required
        />
        {/* حقل العمر */}
        <input
          type="number"
          name="age"
          value={teacher.age}
          onChange={handleChange}
          placeholder="العمر"
          required
          min="18"                      // العمر لا يقل عن 18 سنة
        />
        {/* حقل تاريخ التوظيف */}
        <input
          type="date"
          name="hireDate"
          value={teacher.hireDate}
          onChange={handleChange}
          placeholder="تاريخ التوظيف"
          required
        />
        {/* حقل التخصص */}
        <input
          type="text"
          name="specialty"
          value={teacher.specialty}
          onChange={handleChange}
          placeholder="التخصص"
          required
        />
        {/* حقل سنة التدريس */}
        <input
          type="text"
          name="teachingYear"
          value={teacher.teachingYear}
          onChange={handleChange}
          placeholder="سنة التدريس"
          required
        />
        {/* زر حفظ التغييرات */}
        <button type="submit">💾 حفظ التغييرات</button>
      </form>

      {/* أنماط CSS مدمجة لتنسيق النموذج */}
      <style>{`
        .form-container {
          max-width: 600px;
          margin: 40px auto;
          background: #fff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          direction: rtl; /* اتجاه النص من اليمين لليسار */
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h2 {
          margin-bottom: 25px;
          font-size: 26px;
          color: #1e40af;
          text-align: center;
        }
        form input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        button {
          width: 100%;
          padding: 12px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin-top: 15px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default EditTeacher; // تصدير المكون للاستخدام في التطبيق
