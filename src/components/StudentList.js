import React from 'react';
import { Link } from 'react-router-dom';

const StudentList = ({ students, onDelete }) => (
  <div>
    <h2>قائمة الطلاب</h2>
    <ul>
      {students.map((student) => (
        <li key={student.id}>
          <Link to={`/student/${student.id}`}>{student.name}</Link>
          {' | '}
          <Link to={`/edit/${student.id}`}>تعديل</Link>
          {' | '}
          <button onClick={() => onDelete(student.id)}>حذف</button>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentList;
