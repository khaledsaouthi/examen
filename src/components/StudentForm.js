import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const StudentForm = ({ onSave, students = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({ name: '', age: '', grade: '' });

  useEffect(() => {
    if (isEdit) {
      const student = students.find((s) => s.id === Number(id));
      if (student) setForm(student);
    }
  }, [id, isEdit, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? 'تعديل طالب' : 'إضافة طالب'}</h2>
      <input name="name" placeholder="الاسم" value={form.name} onChange={handleChange} required />
      <input name="age" placeholder="العمر" value={form.age} onChange={handleChange} required />
      <input name="grade" placeholder="الصف" value={form.grade} onChange={handleChange} required />
      <button type="submit">حفظ</button>
    </form>
  );
};

export default StudentForm;
