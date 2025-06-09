import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';  // استيراد useNavigate
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // إنشاء دالة التنقل
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const docRef = doc(db, 'students', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setStudent(docSnap.data());
    };
    fetchStudent();
  }, [id]);

  if (!student) return <p className="loading-msg">⏳ جاري التحميل أو الطالب غير موجود</p>;

  return (
    <div className="student-detail-container">
      <h2>تفاصيل التلميذ</h2>
      <div className="student-info">
        <p><strong>الاسم:</strong> {student.firstName}</p>
        <p><strong>اللقب:</strong> {student.lastName}</p>
        <p><strong>العمر:</strong> {student.age}</p>
        <p><strong>التخصص:</strong> {student.specialty}</p>
        <p><strong>السنة الدراسية:</strong> {student.studyYear}</p>
        <p><strong>الجنس:</strong> {student.gender}</p>
      </div>
      <Link to={`/edit/${id}`} className="edit-link">✏️ تعديل بيانات التلميذ</Link>

      {/* زر العودة للصفحة الرئيسية */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          display: "block"
        }}
      >
        العودة إلى الصفحة الرئيسية
      </button>

      <style>{`
        .student-detail-container {
          max-width: 600px;
          margin: 40px auto;
          background: #fff;
          padding: 30px 40px;
          border-radius: 14px;
          box-shadow: 0 12px 25px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          color: #1f2937;
        }
        h2 {
          font-size: 28px;
          margin-bottom: 25px;
          color: #111827;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 10px;
          font-weight: 700;
        }
        .student-info p {
          font-size: 18px;
          margin: 12px 0;
          border-left: 4px solid #3b82f6;
          padding-left: 12px;
          background-color: #eff6ff;
          border-radius: 6px;
          transition: background-color 0.3s ease;
        }
        .student-info p:hover {
          background-color: #dbeafe;
        }
        .edit-link {
          display: inline-block;
          margin-top: 30px;
          text-decoration: none;
          background-color: #3b82f6;
          color: white;
          padding: 12px 22px;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(59,130,246,0.4);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .edit-link:hover {
          background-color: #2563eb;
          box-shadow: 0 6px 14px rgba(37,99,235,0.6);
        }
        .loading-msg {
          text-align: center;
          font-size: 20px;
          color: #6b7280;
          margin-top: 100px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default StudentDetail;
