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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { app } from "./firebase";

// تهيئة قاعدة بيانات Firestore
const db = getFirestore(app);

// مكون يحمي الصفحات التي تتطلب تسجيل دخول
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth(); // جلب المستخدم الحالي من سياق المصادقة
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  // إذا لم يكن المستخدم مسجل دخول، عرض رسالة ثم إعادة التوجيه للصفحة تسجيل الدخول
  useEffect(() => {
    if (!currentUser) {
      setShowMessage(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [currentUser, navigate]);

  // عرض رسالة للمستخدم إذا لم يكن مسجل دخول
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

  // عرض المحتوى المحمي إذا كان المستخدم مسجل دخول
  return currentUser ? children : null;
};

// المكون الرئيسي داخل الـ Router الذي يدير التلاميذ ويعرض الصفحات حسب الرابط
const AppContent = () => {
  const location = useLocation(); // لمعرفة رابط الصفحة الحالي
  const [students, setStudents] = useState([]); // حالة لتخزين قائمة التلاميذ

  // جلب التلاميذ من قاعدة البيانات
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

  // جلب التلاميذ مرة واحدة عند تحميل المكون
  useEffect(() => {
    fetchStudents();
  }, []);

  // إضافة تلميذ جديد إلى قاعدة البيانات
  const addStudent = async (student) => {
    try {
      await addDoc(collection(db, "students"), student);
      fetchStudents(); // تحديث القائمة بعد الإضافة
    } catch (error) {
      console.error("فشل في إضافة التلميذ:", error);
    }
  };

  // تعديل بيانات تلميذ موجود
  const updateStudent = async (id, updatedStudent) => {
    try {
      const studentRef = doc(db, "students", id);
      await updateDoc(studentRef, updatedStudent);
      fetchStudents(); // تحديث القائمة بعد التعديل
    } catch (error) {
      console.error("فشل في تعديل التلميذ:", error);
    }
  };

  // حذف تلميذ من قاعدة البيانات
  const deleteStudent = async (id) => {
    try {
      const studentRef = doc(db, "students", id);
      await deleteDoc(studentRef);
      fetchStudents(); // تحديث القائمة بعد الحذف
    } catch (error) {
      console.error("فشل في حذف التلميذ:", error);
    }
  };

  return (
    <div className="container">
      {/* عرض شريط التنقل إلا في صفحات تسجيل الدخول والتسجيل */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && <NavBar />}

      {/* تعريف روابط التطبيق والمكونات المرتبطة بها */}
      <Routes>
        {/* صفحة قائمة التلاميذ مع إمكانية الحذف */}
        <Route path="/" element={<StudentList students={students} onDelete={deleteStudent} />} />

        {/* صفحة إضافة تلميذ (محمية بتسجيل دخول) */}
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <StudentForm onSave={addStudent} />
            </PrivateRoute>
          }
        />

        {/* صفحة تعديل تلميذ (محمية بتسجيل دخول) */}
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <StudentForm students={students} onSave={updateStudent} />
            </PrivateRoute>
          }
        />

        {/* صفحة تفاصيل التلميذ (محمية) */}
        <Route
          path="/student/:id"
          element={
            <PrivateRoute>
              <StudentDetail students={students} />
            </PrivateRoute>
          }
        />

        {/* صفحة عرض درجات التلميذ (محمية) */}
        <Route
          path="/student/:id/grades"
          element={
            <PrivateRoute>
              <StudentGrades />
            </PrivateRoute>
          }
        />

        {/* صفحة إضافة درجة للتلميذ (محمية) */}
        <Route
          path="/student/:id/grades/add"
          element={
            <PrivateRoute>
              <AddGrade />
            </PrivateRoute>
          }
        />

        {/* صفحة تعديل درجة للتلميذ (محمية) */}
        <Route
          path="/student/:id/grades/edit/:gradeId"
          element={
            <PrivateRoute>
              <EditGrade />
            </PrivateRoute>
          }
        />

        {/* صفحة إضافة معلم (محمية) */}
        <Route
          path="/add-teacher"
          element={
            <PrivateRoute>
              <TeacherForm />
            </PrivateRoute>
          }
        />

        {/* صفحة قائمة المعلمين (محمية) */}
        <Route
          path="/teachers"
          element={
            <PrivateRoute>
              <TeacherList />
            </PrivateRoute>
          }
        />

        {/* صفحة تفاصيل معلم (محمية) */}
        <Route
          path="/teacher/:id"
          element={
            <PrivateRoute>
              <TeacherDetail />
            </PrivateRoute>
          }
        />

        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* صفحة تسجيل حساب جديد */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

// المكون الأساسي للتطبيق يحتوي Router وسياق المصادقة
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
