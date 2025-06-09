import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

const EditGrade = () => {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const [gradeData, setGradeData] = useState({
    subject: '',
    grade: '',
    coefficient: '',
  });

  useEffect(() => {
    if (role !== 'admin') {
      alert('❌ لا تملك صلاحية تعديل النقاط.');
      navigate(-1);
    }
  }, [role, navigate]);

  const fetchGrade = async () => {
    const gradeRef = doc(db, 'grades', gradeId);
    const snapshot = await getDoc(gradeRef);
    if (snapshot.exists()) {
      setGradeData(snapshot.data());
    } else {
      alert('❌ النقطة غير موجودة!');
      navigate('/');
    }
  };

  useEffect(() => {
    fetchGrade();
  }, [gradeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gradeRef = doc(db, 'grades', gradeId);
    await updateDoc(gradeRef, {
      subject: gradeData.subject,
      grade: Number(gradeData.grade),
      coefficient: Number(gradeData.coefficient),
    });
    alert('✅ تم تعديل النقطة بنجاح!');
    navigate(-1);
  };

  return (
    <div className="edit-grade-container">
      <h2>✏️ تعديل النقطة</h2>
      <form onSubmit={handleSubmit}>
        <label>المادة:</label>
        <input
          type="text"
          value={gradeData.subject}
          onChange={(e) => setGradeData({ ...gradeData, subject: e.target.value })}
          required
        />

        <label>النقطة:</label>
        <input
          type="number"
          min="0"
          max="20"
          step="0.01"
          value={gradeData.grade}
          onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
          required
        />

        <label>المعامل:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={gradeData.coefficient}
          onChange={(e) => setGradeData({ ...gradeData, coefficient: e.target.value })}
          required
        />

        <button type="submit">💾 حفظ التعديلات</button>
      </form>

      <style>{`
        .edit-grade-container {
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #f9fafb;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          direction: rtl;
        }

        h2 {
          font-size: 24px;
          color: #1e293b;
          margin-bottom: 20px;
        }

        form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        label {
          font-weight: 600;
          color: #334155;
        }

        input {
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s ease;
        }

        input:focus {
          border-color: #3b82f6;
          outline: none;
        }

        button {
          background-color: #10b981;
          color: white;
          font-size: 16px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #059669;
        }
      `}</style>
    </div>
  );
};

export default EditGrade;
