import React, { useEffect, useState, useContext } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const subjects = [
  { name: 'رياضيات', coefficient: 4 },
  { name: 'فيزياء', coefficient: 3 },
  { name: 'لغة عربية', coefficient: 2 },
  { name: 'لغة فرنسية', coefficient: 2 },
  { name: 'لغة إنقليزية', coefficient: 2 },
  { name: 'تاريخ و جغرافيا', coefficient: 2 },
  { name: 'فلسفة', coefficient: 2 },
  { name: 'علوم', coefficient: 3 },
  { name: 'رياضة', coefficient: 1 },
];

const AddGrade = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    grade: '',
  });

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!role || (role !== 'admin' && role !== 'teacher')) {
      alert('❌ لا تملك صلاحية الوصول لهذه الصفحة.');
      navigate('/');
      return;
    }

    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'students'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(data);
      } catch (error) {
        alert('فشل تحميل التلاميذ');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.grade < 0 || form.grade > 20) {
      return alert('❌ النقطة يجب أن تكون بين 0 و 20');
    }

    const selectedSubject = subjects.find(s => s.name === form.subject);
    if (!selectedSubject) return alert('❌ يرجى اختيار مادة صحيحة');

    const gradeData = {
      studentId: form.studentId,
      subject: form.subject,
      grade: parseFloat(form.grade),
      coefficient: selectedSubject.coefficient,
      total: parseFloat(form.grade) * selectedSubject.coefficient,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'grades'), gradeData);
      alert('✅ تمت إضافة النقطة بنجاح');
      setForm({ studentId: '', subject: '', grade: '' });
    } catch (err) {
      alert('❌ حدث خطأ أثناء الإضافة: ' + err.message);
    }
  };

  if (loading) return <p>⏳ جاري تحميل التلاميذ...</p>;

  return (
    <div className="grade-form-container">
      <h2>➕ إضافة نقطة لتلميذ</h2>
      <form onSubmit={handleSubmit}>
        <label>اسم التلميذ:</label><br />
        <select name="studentId" value={form.studentId} onChange={handleChange} required>
          <option value="">-- اختر تلميذًا --</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select><br /><br />

        <label>المادة:</label><br />
        <select name="subject" value={form.subject} onChange={handleChange} required>
          <option value="">-- اختر مادة --</option>
          {subjects.map((s, idx) => (
            <option key={idx} value={s.name}>
              {s.name} (معامل: {s.coefficient})
            </option>
          ))}
        </select><br /><br />

        <label>النقطة (من 0 إلى 20):</label><br />
        <input
          type="number"
          name="grade"
          step="0.01"
          min="0"
          max="20"
          value={form.grade}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">💾 حفظ</button>
      </form>

      <style>{`
        .grade-form-container {
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
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
        }

        label {
          font-weight: 600;
          color: #334155;
        }

        select, input {
          width: 100%;
          padding: 12px;
          margin-bottom: 20px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s ease;
        }

        select:focus, input:focus {
          border-color: #3b82f6;
          outline: none;
        }

        button {
          background-color: #2563eb;
          color: white;
          font-size: 16px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
        }

        button:hover {
          background-color: #1e40af;
        }

        p {
          text-align: center;
          font-size: 14px;
          color: #e11d48;
        }
      `}</style>
    </div>
  );
};

export default AddGrade;
