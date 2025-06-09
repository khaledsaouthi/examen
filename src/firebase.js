// استيراد دالة initializeApp من مكتبة firebase/app لتهيئة تطبيق Firebase
import { initializeApp } from 'firebase/app';

// استيراد getFirestore للحصول على قاعدة بيانات Firestore من Firebase
import { getFirestore } from 'firebase/firestore';

// استيراد getAuth للحصول على خدمة المصادقة، وGoogleAuthProvider لاستخدام تسجيل الدخول بحساب Google
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// كائن إعدادات Firebase يحتوي على معلومات المشروع من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAtifM-67J2k3v1bG98onxLvd8bgflsA3Q", // مفتاح API الخاص بالمشروع
  authDomain: "examen-fc768.firebaseapp.com",        // نطاق المصادقة (Authentication domain)
  projectId: "examen-fc768",                         // معرف المشروع في Firebase
  storageBucket: "examen-fc768.firebasestorage.app", // مساحة التخزين السحابية للمشروع
  messagingSenderId: "712504490692",                 // معرف مرسل الرسائل (لـ Firebase Cloud Messaging)
  appId: "1:712504490692:web:c954c01448e4d728fde791", // معرف التطبيق (App ID)
  measurementId: "G-EQQ7TPL8ES"                      // معرف Google Analytics (اختياري)
};

// تهيئة تطبيق Firebase باستخدام الإعدادات السابقة
export const app = initializeApp(firebaseConfig);

// تهيئة قاعدة بيانات Firestore وربطها بالتطبيق
export const db = getFirestore(app);

// تهيئة خدمة المصادقة وربطها بالتطبيق
export const auth = getAuth(app);

// إنشاء مزود تسجيل الدخول باستخدام حساب Google
export const provider = new GoogleAuthProvider();
