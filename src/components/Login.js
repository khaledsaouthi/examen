import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { provider, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';




const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    }
  };
  // Google authentication
  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // تحقق إن كان المستخدم موجودًا مسبقًا في Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // إنشاء مستخدم جديد بدور teacher (أو أي دور تختاره)
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        role: "teacher"
      });
    }

    navigate("/");
  } catch (err) {
    console.error("خطأ في تسجيل الدخول بـ Google:", err);
    setError("حدث خطأ أثناء تسجيل الدخول بـ Google");
  }
};


  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>تسجيل الدخول</h2>
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

        <button type="submit">تسجيل الدخول</button>

        <p className="signup-link">
          ليس لديك حساب؟{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
          >
            أنشئ حساب الآن
          </button>
        </p>
        <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
             width: "100%",
              padding: "12px",
              marginTop: "10px",
              border: "none",
             borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "#ea4335",
               color: "white",
                cursor: "pointer",
               fontWeight: "bold"
               }}
                >
                 تسجيل الدخول باستخدام Google
        </button>


        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/')}
        >
          الرجوع إلى القائمة الرئيسية
        </button>
      </form>

      <style>{`
        .login-container {
          direction: rtl;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #f1f5f9;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }

        .login-form h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .login-form label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-weight: 500;
        }

        .login-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s;
        }

        .login-form input:focus {
          border-color: #3b82f6;
          outline: none;
        }

        .login-form button {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          background-color: #2563eb;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }

        .login-form .back-button {
          background-color: #64748b;
        }

        .login-form button:hover {
          background-color: #1e40af;
        }

        .login-form .back-button:hover {
          background-color: #475569;
        }

        .signup-link {
          margin-top: 20px;
          text-align: center;
        }

        .signup-link button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          text-decoration: underline;
          font-size: 1em;
        }

        .signup-link button:hover {
          color: #1d4ed8;
        }

        .error {
          color: red;
          margin-bottom: 15px;
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Login;
