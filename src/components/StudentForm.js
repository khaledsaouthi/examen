import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    specialty: "",
    studyYear: "",
    gender: "",
  });

  useEffect(() => {
    if (isEdit) {
      const fetchStudent = async () => {
        const docRef = doc(db, "students", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setForm(docSnap.data());
      };
      fetchStudent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const docRef = doc(db, "students", id);
        await setDoc(docRef, form);
      } else {
        await addDoc(collection(db, "students"), form);
      }
      navigate("/");
    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error);
      alert("حدث خطأ: " + error.message);
    }
  };
  const { role } = useAuth();

  useEffect(() => {
    if (role === "student") {
      alert("ليس لديك صلاحية للوصول إلى هذه الصفحة.");
      navigate("/");
    }
  }, [role, navigate]);

  return (
    <div className="student-form-container">
      <form onSubmit={handleSubmit} className="student-form">
        <h2>{isEdit ? "تعديل تلميذ" : "إضافة تلميذ"}</h2>

        <input
          name="firstName"
          placeholder="الاسم"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <input
          name="lastName"
          placeholder="اللقب"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <input
          name="age"
          placeholder="العمر"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
        />

        <input
          name="specialty"
          placeholder="التخصص"
          value={form.specialty}
          onChange={handleChange}
          required
        />

        <input
          name="studyYear"
          placeholder="السنة الدراسية"
          value={form.studyYear}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">اختر الجنس</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>

        <button type="submit">حفظ</button>
      </form>

      <style>
        {`
          .student-form-container {
            direction: rtl;
            padding: 30px;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: #f1f5f9;
            min-height: 100vh;
          }

          .student-form {
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 25px 30px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }

          .student-form h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #1e293b;
          }

          .student-form input,
          .student-form select {
            width: 100%;
            padding: 12px 14px;
            margin-bottom: 15px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
          }

          .student-form input:focus,
          .student-form select:focus {
            border-color: #2563eb;
            outline: none;
          }

          .student-form button {
            width: 100%;
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
          }

          .student-form button:hover {
            background: #1e40af;
          }
        `}
      </style>
    </div>
  );
};

export default StudentForm;
