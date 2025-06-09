import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

const StudentGrades = () => {
  const { id } = useParams();
  const [grades, setGrades] = useState([]);
  const { role } = useContext(AuthContext);

  const fetchGrades = async () => {
    const q = query(collection(db, 'grades'), where('studentId', '==', id));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGrades(list);
  };

  useEffect(() => {
    fetchGrades();
  }, [id]);

  const handleDelete = async (gradeId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه النقطة؟")) {
      await deleteDoc(doc(db, 'grades', gradeId));
      fetchGrades();
    }
  };

  const totalWeighted = grades.reduce((acc, g) => acc + g.grade * g.coefficient, 0);
  const totalCoefficients = grades.reduce((acc, g) => acc + g.coefficient, 0);
  const average = totalCoefficients ? (totalWeighted / totalCoefficients).toFixed(2) : '—';

  return (
    <div className="grades-container">
      <h2>نقاط التلميذ</h2>

      {role === 'teacher' && (
        <div className="add-grade-wrapper">
          <Link to={`/student/${id}/grades/add`}>
            <button className="btn add-btn">➕ إضافة نقطة</button>
          </Link>
        </div>
      )}

      {grades.length === 0 ? (
        <p className="no-grades">لا توجد نقاط بعد.</p>
      ) : (
        <table className="grades-table">
          <thead>
            <tr>
              <th>المادة</th>
              <th>النقطة</th>
              <th>المعامل</th>
              {role === 'admin' && <th>إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr key={g.id}>
                <td>{g.subject}</td>
                <td>{g.grade}</td>
                <td>{g.coefficient}</td>
                {role === 'admin' && (
                  <td className="actions">
                    <button className="btn delete-btn" onClick={() => handleDelete(g.id)}>🗑 حذف</button>
                    <Link to={`/student/${id}/grades/edit/${g.id}`}>
                      <button className="btn edit-btn">✏️ تعديل</button>
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 className="average">📊 المعدل العام: <span>{average}</span></h3>

      <Link to="/">
        <button className="btn back-btn">⬅️ رجوع إلى قائمة التلاميذ</button>
      </Link>

      <style>{`
        .grades-container {
          max-width: 700px;
          margin: 40px auto;
          background: #fff;
          padding: 30px 40px;
          border-radius: 14px;
          box-shadow: 0 14px 28px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          color: #1f2937;
        }

        h2 {
          font-size: 30px;
          margin-bottom: 25px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
          font-weight: 700;
          color: #1e40af;
        }

        .add-grade-wrapper {
          margin-bottom: 20px;
          text-align: right;
        }

        .btn {
          cursor: pointer;
          font-weight: 600;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 16px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .add-btn {
          background-color: #2563eb;
          color: white;
          box-shadow: 0 6px 12px rgba(37,99,235,0.4);
        }
        .add-btn:hover {
          background-color: #1e40af;
          box-shadow: 0 8px 16px rgba(30,64,175,0.6);
        }

        .grades-table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          border-radius: 12px;
          overflow: hidden;
        }

        .grades-table th, .grades-table td {
          padding: 14px 20px;
          text-align: center;
        }

        .grades-table thead {
          background-color: #3b82f6;
          color: white;
          font-weight: 700;
          font-size: 18px;
        }

        .grades-table tbody tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .delete-btn {
          background-color: #ef4444;
          color: white;
          box-shadow: 0 4px 10px rgba(239,68,68,0.4);
        }
        .delete-btn:hover {
          background-color: #b91c1c;
          box-shadow: 0 6px 14px rgba(185,28,28,0.6);
        }

        .edit-btn {
          background-color: #fbbf24;
          color: #78350f;
          box-shadow: 0 4px 10px rgba(251,191,36,0.4);
        }
        .edit-btn:hover {
          background-color: #b45309;
          color: white;
          box-shadow: 0 6px 14px rgba(180,83,9,0.6);
        }

        .no-grades {
          font-size: 18px;
          text-align: center;
          color: #6b7280;
          margin: 40px 0;
        }

        .average {
          margin-top: 30px;
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          border-top: 2px solid #3b82f6;
          padding-top: 15px;
          text-align: center;
        }
        .average span {
          color: #2563eb;
        }

        .back-btn {
          margin-top: 30px;
          background-color: #6b7280;
          color: white;
          display: block;
          width: 100%;
          padding: 14px 0;
          border-radius: 10px;
          font-size: 18px;
          box-shadow: 0 6px 14px rgba(107,114,128,0.6);
          transition: background-color 0.3s ease;
        }
        .back-btn:hover {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default StudentGrades;
