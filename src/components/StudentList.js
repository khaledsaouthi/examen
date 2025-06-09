import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { AuthContext } from "../context/AuthContext";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const { role } = useContext(AuthContext);

  // جلب جميع التلاميذ من قاعدة البيانات
  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'students'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(data);
    } catch (error) {
      console.error("فشل في جلب التلاميذ:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // حذف التلميذ (للمشرف فقط)
  const handleDelete = async (id) => {
    if (role !== "admin") {
      alert("ليس لديك صلاحية الحذف");
      return;
    }

    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا التلميذ؟")) {
      try {
        await deleteDoc(doc(db, 'students', id));
        fetchStudents();
      } catch (error) {
        console.error("فشل في حذف التلميذ:", error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="title">قائمة التلاميذ</h2>

      {students.length === 0 ? (
        <p className="empty">لا يوجد تلاميذ.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>اللقب</th>
              <th>العمر</th>
              <th>التخصص</th>
              <th>السنة الدراسية</th>
              <th>الجنس</th>
              <th>الإجراءات</th>
              <th>النقاط</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.age}</td>
                <td>{student.specialty}</td>
                <td>{student.studyYear}</td>
                <td>{student.gender}</td>
                <td>
                  <Link to={`/student/${student.id}`} className="btn view">عرض</Link>

                  {/* المشرف فقط يمكنه التعديل الكامل */}
                  {role === 'admin' && (
                    <>
                      <Link to={`/edit/${student.id}`} className="btn edit">تعديل</Link>
                      <button onClick={() => handleDelete(student.id)} className="btn delete">حذف</button>
                    </>
                  )}

                  {/* المعلم فقط يمكنه إضافة نقاط */}
                  {role === 'teacher' && (
                    <Link to={`/student/${student.id}/grades/add`} className="btn add">إضافة نقطة</Link>
                  )}
                </td>
                <td>
                  <Link to={`/student/${student.id}/grades`} className="btn grades">عرض النقاط</Link>
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
            color: #333;
            margin-bottom: 20px;
          }

          .empty {
            text-align: center;
            font-size: 18px;
            color: #777;
          }

          .student-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            overflow: hidden;
          }

          .student-table th, .student-table td {
            padding: 12px 16px;
            text-align: center;
            border-bottom: 1px solid #eee;
          }

          .student-table th {
            background-color: #f1f5f9;
            font-weight: bold;
            color: #444;
          }

          .student-table tr:hover {
            background-color: #f9f9f9;
          }

          .btn {
            margin: 0 5px;
            padding: 6px 10px;
            border: none;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .btn.view {
            background-color: #4f46e5;
            color: white;
          }

          .btn.edit {
            background-color: #059669;
            color: white;
          }

          .btn.delete {
            background-color: #dc2626;
            color: white;
          }

          .btn.add {
            background-color: #f59e0b;
            color: white;
          }

          .btn.grades {
            background-color: #0ea5e9;
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

export default StudentList;
