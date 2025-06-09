import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="nav-right">
          <Link to="/" className="nav-link">الطلاب</Link>


        {role !== "student" && (
          <Link to="/add" className="nav-link">إضافة طالب</Link>
        )}

        
         {role === "admin" && (
         <>
        <Link to="/teachers" className="nav-link">قائمة الأساتذة</Link>
        <Link to="/add-teacher" className="nav-link">إضافة أستاذ</Link>
        <Link to="/signup" className="nav-link">إنشاء حساب</Link>
        </>
        )}

          


        </div>

        {currentUser && (
          <div className="nav-left">
            <span className="user-role">
              أنت مسجل كـ: <strong>
                {role === "admin"
                  ? "مدير"
                  : role === "teacher"
                  ? "معلم"
                  : role === "student"
                  ? "طالب"
                  : "غير معروف"}
              </strong>
            </span>
            <button className="logout-btn" onClick={handleLogout}>تسجيل الخروج</button>
          </div>
        )}
      </nav>

      <style>
        {`
          .navbar-container {
            background: #1e293b;
            padding: 12px 24px;
            color: white;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            direction: rtl;
          }

          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
          }

          .nav-right, .nav-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .nav-link {
            color: white;
            text-decoration: none;
            padding: 8px 14px;
            border-radius: 6px;
            transition: background 0.3s;
          }

          .nav-link:hover {
            background: #334155;
          }

          .user-role {
            margin-left: 10px;
          }

          .logout-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s, transform 0.2s;
          }

          .logout-btn:hover {
            background: #dc2626;
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default NavBar;
