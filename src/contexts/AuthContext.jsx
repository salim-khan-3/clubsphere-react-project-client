import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import axiosInstance from "../utils/axiosInstance";
// import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register with email/password
  const register = async (name, email, password, photoURL) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name, photoURL });
    await saveUserToDB({ name, email, photoURL });
    return result;
  };

  // Login
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Google login
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToDB({
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    });
    return result;
  };

  // Logout
  const logout = () => {
    setDbUser(null);
    return signOut(auth);
  };

  // Save user to MongoDB
  const saveUserToDB = async (userData) => {
    try {
      const res = await axiosInstance.post("/users", userData);
      setDbUser(res.data.user);
    } catch (err) {
      console.error("Failed to save user to DB:", err);
    }
  };

  // Fetch user role from DB
  const fetchDBUser = async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      setDbUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch db user:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchDBUser();
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    dbUser,
    loading,
    register,
    login,
    googleLogin,
    logout,
    fetchDBUser,
    isAdmin: dbUser?.role === "admin",
    isManager: dbUser?.role === "clubManager",
    isMember: dbUser?.role === "member",
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
