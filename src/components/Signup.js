import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const allowedRoles = ['student', 'teacher'];
    const selectedRole = allowedRoles.includes(role) ? role : 'student';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        role: selectedRole
      });

      navigate('/');
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب: ' + err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2>إنشاء حساب</h2>
        {error && <p className="error">{error}</p>}

        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>كلمة المرور:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>نوع الحساب:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">طالب</option>
          <option value="teacher">معلم</option>
        </select>

        <button type="submit">تسجيل</button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="back-button"
        >
          الرجوع إلى القائمة الرئيسية
        </button>
      </form>

      <style>{`
        .signup-container {
          direction: rtl;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .signup-form {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .signup-form h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .signup-form label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-weight: 500;
        }

        .signup-form input,
        .signup-form select {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s;
        }

        .signup-form input:focus,
        .signup-form select:focus {
          border-color: #3b82f6;
          outline: none;
        }

        .signup-form button {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          background-color: #2563eb;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }

        .signup-form .back-button {
          background-color: #64748b;
        }

        .signup-form button:hover {
          background-color: #1e40af;
        }

        .signup-form .back-button:hover {
          background-color: #475569;
        }

        .error {
          color: red;
          margin-bottom: 15px;
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Signup;
