import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // استيراد useNavigate
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // إنشاء دالة التنقل
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      const teacherRef = doc(db, 'teachers', id);
      const snapshot = await getDoc(teacherRef);
      if (snapshot.exists()) {
        setTeacher({ id: snapshot.id, ...snapshot.data() });
      } else {
        alert('الأستاذ غير موجود');
      }
    };
    fetchTeacher();
  }, [id]);

  if (!teacher) {
    return <p className="loading">جارٍ تحميل البيانات...</p>;
  }

  return (
    <div className="teacher-detail-container">
      <h2>معلومات الأستاذ</h2>
      <div className="info">
        <p><strong>الاسم:</strong> {teacher.firstName}</p>
        <p><strong>اللقب:</strong> {teacher.lastName}</p>
        <p><strong>العمر:</strong> {teacher.age}</p>
        <p><strong>تاريخ التوظيف:</strong> {teacher.hireDate}</p>
        <p><strong>التخصص:</strong> {teacher.specialty}</p>
        <p><strong>سنة التدريس:</strong> {teacher.teachingYear}</p>
      </div>

      {/* زر العودة للصفحة الرئيسية */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        العودة إلى الصفحة الرئيسية
      </button>

      <style>{`
        .teacher-detail-container {
          max-width: 600px;
          margin: 50px auto;
          background: #fff;
          padding: 30px 35px;
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          color: #374151;
        }
        h2 {
          font-size: 28px;
          color: #2563eb;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
          margin-bottom: 30px;
          font-weight: 700;
        }
        .info p {
          font-size: 18px;
          margin-bottom: 18px;
          background: #f3f4f6;
          padding: 12px 20px;
          border-radius: 10px;
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05);
        }
        strong {
          color: #1e40af;
          min-width: 130px;
          display: inline-block;
        }
        .loading {
          text-align: center;
          font-size: 20px;
          color: #6b7280;
          margin-top: 100px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default TeacherDetail;
