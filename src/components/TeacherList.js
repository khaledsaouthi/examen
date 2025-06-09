import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();
  const { role } = useAuth();

  const fetchTeachers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'teachers'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeachers(data);
    } catch (error) {
      console.error("فشل في جلب الأساتذة:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (role !== "admin") {
      alert("ليس لديك صلاحية الحذف");
      return;
    }

    const confirmDelete = window.confirm('هل أنت متأكد من حذف هذا الأستاذ؟');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'teachers', id));
        fetchTeachers();
      } catch (error) {
        console.error("فشل في حذف الأستاذ:", error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="title">قائمة الأساتذة</h2>
      {teachers.length === 0 ? (
        <p className="empty">لا يوجد أساتذة بعد.</p>
      ) : (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>اللقب</th>
              <th>العمر</th>
              <th>تاريخ التوظيف</th>
              <th>التخصص</th>
              <th>سنة التدريس</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.firstName}</td>
                <td>{teacher.lastName}</td>
                <td>{teacher.age}</td>
                <td>{teacher.hireDate}</td>
                <td>{teacher.specialty}</td>
                <td>{teacher.teachingYear}</td>
                <td>
                  <button className="btn view" onClick={() => navigate(`/teacher/${teacher.id}`)}>عرض</button>
                  {role === 'admin' && (
                    <>
                      <button className="btn edit" onClick={() => navigate(`/edit-teacher/${teacher.id}`)}>تعديل</button>
                      <button className="btn delete" onClick={() => handleDelete(teacher.id)}>حذف</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>
        {`
          .container {
            padding: 20px;
            font-family: 'Segoe UI', sans-serif;
            background-color: #f9fafc;
          }

          .title {
            text-align: center;
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 24px;
          }

          .empty {
            text-align: center;
            font-size: 18px;
            color: #6b7280;
          }

          .teacher-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
          }

          .teacher-table th, .teacher-table td {
            padding: 12px 16px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
          }

          .teacher-table th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
          }

          .teacher-table tr:hover {
            background-color: #f9fafb;
          }

          .btn {
            margin: 0 4px;
            padding: 6px 10px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn.view {
            background-color: #3b82f6;
            color: white;
          }

          .btn.edit {
            background-color: #10b981;
            color: white;
          }

          .btn.delete {
            background-color: #ef4444;
            color: white;
          }

          .btn:hover {
            opacity: 0.9;
            transform: scale(1.03);
          }
        `}
      </style>
    </div>
  );
};

export default TeacherList;
