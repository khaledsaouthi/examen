import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import StudentDetail from "./components/StudentDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NavBar from "./components/NavBar";
import TeacherForm from "./components/TeacherForm";
import TeacherList from "./components/TeacherList";
import TeacherDetail from "./components/TeacherDetail";
import StudentGrades from "./components/StudentGrades";
import AddGrade from "./components/AddGrade";
import EditGrade from "./components/EditGrade";
import EditTeacher from "./components/EditTeacher";  // تم الاستيراد
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setShowMessage(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [currentUser, navigate]);

  if (!currentUser && showMessage) {
    return (
      <div
        style={{
          padding: "20px",
          margin: "40px auto",
          width: "fit-content",
          backgroundColor: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffeeba",
          borderRadius: "5px",
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        من فضلك سجل دخولك أولاً...
      </div>
    );
  }

  return currentUser ? children : null;
};

const AppContent = () => {
  const location = useLocation();
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "students"));
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    } catch (error) {
      console.error("خطأ في جلب التلاميذ:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async (student) => {
    try {
      await addDoc(collection(db, "students"), student);
      fetchStudents();
    } catch (error) {
      console.error("فشل في إضافة التلميذ:", error);
    }
  };

  const updateStudent = async (id, updatedStudent) => {
    try {
      const studentRef = doc(db, "students", id);
      await updateDoc(studentRef, updatedStudent);
      fetchStudents();
    } catch (error) {
      console.error("فشل في تعديل التلميذ:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const studentRef = doc(db, "students", id);
      await deleteDoc(studentRef);
      fetchStudents();
    } catch (error) {
      console.error("فشل في حذف التلميذ:", error);
    }
  };

  return (
    <div className="container">
      {location.pathname !== "/login" && location.pathname !== "/signup" && <NavBar />}

      <Routes>
        <Route path="/" element={<StudentList students={students} onDelete={deleteStudent} />} />

        <Route
          path="/add"
          element={
            <PrivateRoute>
              <StudentForm onSave={addStudent} />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <StudentForm students={students} onSave={updateStudent} />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/:id"
          element={
            <PrivateRoute>
              <StudentDetail students={students} />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/:id/grades"
          element={
            <PrivateRoute>
              <StudentGrades />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/:id/grades/add"
          element={
            <PrivateRoute>
              <AddGrade />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/:id/grades/edit/:gradeId"
          element={
            <PrivateRoute>
              <EditGrade />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-teacher"
          element={
            <PrivateRoute>
              <TeacherForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <PrivateRoute>
              <TeacherList />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/:id"
          element={
            <PrivateRoute>
              <TeacherDetail />
            </PrivateRoute>
          }
        />

        {/* *** إضافة مسار تعديل بيانات الأستاذ هنا *** */}
        <Route
          path="/teacher/:id/edit"
          element={
            <PrivateRoute>
              <EditTeacher />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
