// استيراد الأدوات اللازمة من React لإنشاء السياق واستخدام الحالة والتأثيرات الجانبية
import { createContext, useContext, useEffect, useState } from "react";

// استيراد كائنات المصادقة وقاعدة البيانات من ملف firebase.js
import { auth, db } from "../firebase";

// استيراد دالة مراقبة حالة تسجيل الدخول، ودالة تسجيل الخروج
import { onAuthStateChanged, signOut } from "firebase/auth";

// استيراد دوال التعامل مع مستندات Firestore
import { doc, getDoc } from "firebase/firestore";

// إنشاء السياق الخاص بالمصادقة
export const AuthContext = createContext();

// إنشاء المزود (Provider) الذي سيغلف التطبيق لتوفير معلومات المستخدم
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // حالة لتخزين المستخدم الحالي
  const [role, setRole] = useState(null);               // حالة لتخزين دور المستخدم (مثل: admin, teacher)
  const [loading, setLoading] = useState(true);         // حالة لتحديد ما إذا كانت البيانات لا تزال تُحمّل

  // useEffect لتشغيل كود مرة واحدة عند تحميل المكون (للاستماع لتغير حالة تسجيل الدخول)
  useEffect(() => {
    // الاشتراك في تغييرات حالة تسجيل الدخول (login/logout)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user); // تعيين المستخدم الحالي

      if (user) {
        // جلب مستند المستخدم من Firestore باستخدام uid
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRole(docSnap.data().role); // إذا كان المستند موجودًا، تعيين الدور من البيانات
        } else {
          setRole(null); // إذا لم يوجد المستند، تعيين الدور كـ null
        }
      } else {
        setRole(null); // إذا لم يكن هناك مستخدم مسجل، تعيين الدور كـ null
      }

      setLoading(false); // الانتهاء من التحميل
    });

    // تنظيف الاشتراك عند إزالة المكون
    return () => unsubscribe();
  }, []);

  // دالة لتسجيل الخروج
  const logout = () => signOut(auth);

  // إرجاع المزود الذي يحتوي على المستخدم الحالي، دوره، ودالة تسجيل الخروج
  return (
    <AuthContext.Provider value={{ currentUser, role, logout }}>
      {/* لا يتم عرض الأطفال (children) حتى تنتهي عملية التحميل */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// دالة مخصصة لاستخدام السياق بسهولة في المكونات الأخرى
export const useAuth = () => useContext(AuthContext);
