import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './components/StudentDetail';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const addStudent = (student) => {
    setStudents([...students, { ...student, id: Date.now() }]);
  };

  const updateStudent = (updated) => {
    setStudents(students.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<StudentList students={students} onDelete={deleteStudent} />} />
        <Route path="/add" element={<StudentForm onSave={addStudent} />} />
        <Route path="/edit/:id" element={<StudentForm students={students} onSave={updateStudent} />} />
        <Route path="/student/:id" element={<StudentDetail students={students} />} />
      </Routes>
    </Router>
  );
}

export default App;
