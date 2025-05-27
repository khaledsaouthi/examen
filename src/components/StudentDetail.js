import React from 'react';
import { useParams, Link } from 'react-router-dom';

const StudentDetail = ({ students }) => {
  const { id } = useParams();
  const student = students.find((s) => s.id === Number(id));

  if (!student) return <p>الطالب غير موجود</p>;

  return (
    <div>
      <h2>تفاصيل الطالب</h2>
      <p><strong>الاسم:</strong> {student.name}</p>
      <p><strong>العمر:</strong> {student.age}</p>
      <p><strong>الصف:</strong> {student.grade}</p>
      <Link to={`/edit/${student.id}`}>تعديل</Link>
    </div>
  );
};

export default StudentDetail;
