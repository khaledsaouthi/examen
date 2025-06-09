import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const TeacherForm = ({ onSave }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    hireDate: '',
    specialty: '',
    teachingYear: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تحقق أساسي (اختياري)
    if (
      !form.firstName ||
      !form.lastName ||
      !form.age ||
      !form.hireDate ||
      !form.specialty ||
      !form.teachingYear
    ) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    try {
      await addDoc(collection(db, 'teachers'), form);
      if (onSave) onSave(form);
      alert("✅ تمت إضافة الأستاذ بنجاح");

      // إعادة تعيين النموذج
      setForm({
        firstName: '',
        lastName: '',
        age: '',
        hireDate: '',
        specialty: '',
        teachingYear: ''
      });
    } catch (error) {
      alert("❌ حدث خطأ أثناء الحفظ: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="teacher-form">
        <h2>🧑‍🏫 إضافة أستاذ جديد</h2>

        <label>الاسم الشخصي:</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <label>اللقب:</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <label>العمر:</label>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
        />

        <label>تاريخ التوظيف:</label>
        <input
          name="hireDate"
          type="date"
          value={form.hireDate}
          onChange={handleChange}
          required
        />

        <label>التخصص:</label>
        <input
          name="specialty"
          value={form.specialty}
          onChange={handleChange}
          required
        />

        <label>سنة التدريس:</label>
        <input
          name="teachingYear"
          value={form.teachingYear}
          onChange={handleChange}
          required
        />

        <button type="submit">💾 حفظ</button>
      </form>

      <style>
        {`
          .form-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            background-color: #f9fafb;
            min-height: 100vh;
            font-family: 'Segoe UI', sans-serif;
          }

          .teacher-form {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 30px 25px;
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .teacher-form h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #111827;
          }

          .teacher-form label {
            font-weight: 500;
            color: #374151;
            margin-bottom: 4px;
          }

          .teacher-form input {
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            outline: none;
            font-size: 15px;
            transition: border-color 0.3s;
          }

          .teacher-form input:focus {
            border-color: #3b82f6;
          }

          .teacher-form button {
            background-color: #3b82f6;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s, transform 0.2s;
          }

          .teacher-form button:hover {
            background-color: #2563eb;
            transform: scale(1.03);
          }
        `}
      </style>
    </div>
  );
};

export default TeacherForm;
