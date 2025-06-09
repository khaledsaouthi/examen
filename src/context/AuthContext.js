import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth"; // ✅ أضف signOut
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setCurrentUser(user);
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRole(docSnap.data().role); // تأكد أنه هنا يتم قراءة الدور الصحيح
      } else {
        setRole(null);
      }
    } else {
      setRole(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);


  const logout = () => signOut(auth); // ✅ دالة الخروج

  return (
    <AuthContext.Provider value={{ currentUser, role, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
