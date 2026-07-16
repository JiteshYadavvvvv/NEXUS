import axios from "axios";
import { useEffect, useState, createContext, useContext } from "react";
import { setAuthToken } from "@/lib/authSetup";


const AuthContext = createContext();
const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
if (!import.meta.env.VITE_BACKEND_URL) {
  console.warn("AuthContext: VITE_BACKEND_URL is not defined in .env. Falling back to default URL.");
}
console.log("AuthContext: Backend API URL set to:", API);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/get-user-info`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const checkAdminAuth = async () => {
    try {
      const res = await fetch(`${API}/api/admin/get-admin-info`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const [userData, adminData] = await Promise.all([checkAuth(), checkAdminAuth()]);
      if (adminData) {
        setIsAdmin(true);
        if (!userData) {
          setUser(adminData);
        } else {
          setUser({ ...userData, club: adminData.club });
        }
      }
      setAuthLoading(false);
    };
    init();
  }, []);

  // [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
  // login and signUp are kept as stubs so existing destructures don't crash.
  // The routes POST /api/auth/login and POST /api/auth/register are also
  // commented out on the backend. To re-enable, restore the implementations
  // below and uncomment the matching backend routes in authRoutes.js.

  const login = async (_email, _password) => {
    return { success: false, message: 'Email/password login is disabled — please use Google login.' };
  };
  /* --- original login implementation ---
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { email: email, password: password },
        { withCredentials: true },
      );
      if (res.data.success) {
        if (res.data.token) setAuthToken(res.data.token);
        const userInfo = await checkAuth();
        return { success: true, message: "Successfully Login", user: userInfo };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };
  */

  const signUp = async (_name, _email, _password, _year) => {
    return { success: false, message: 'Email/password registration is disabled — please use Google login.' };
  };
  /* --- original signUp implementation ---
  const signUp = async (name, email, password, year) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/register`,
        { name: name, email: email, password: password, year: year },
        { withCredentials: true },
      );
      if (res.data.success) {
        if (res.data.token) setAuthToken(res.data.token);
        const userInfo = await checkAuth();
        return { success: true, message: "Signup Successful", user: userInfo };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };
  */

  // Google Auth
  const googleAuth = async (token) => {
    try {
      const res = await fetch(`${API}/api/auth/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) setAuthToken(data.token);
        const userInfo = await checkAuth();
        return { success: true, message: data.message || "Google login successful", user: userInfo };
      }
      return { success: false, message: data.message || "Google auth failed" };
    } catch (err) {
      return { success: false, message: err.message || "Google auth failed" };
    }
  };

  // Update User Info
  const updateUserInfo = async (data) => {
    try {
      const isFormData = data instanceof FormData;
      const res = await fetch(`${API}/api/auth/update-user-info`, {
        method: "POST",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        credentials: "include",
        body: isFormData ? data : JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        const userInfo = await checkAuth();
        setUser(userInfo);
        return { success: true, message: json.message || "Updated successfully", user: userInfo };
      }
      return { success: false, message: json.message || "Update failed" };
    } catch (err) {
      return { success: false, message: err.message || "Update failed" };
    }
  };

  //   logout
  const logout = async () => {
    await axios.post(
      `${API}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    setAuthToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  // [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
  // sendVerifyOtp and verifyAccount are kept as stubs. The routes
  // POST /api/auth/verify-otp and POST /api/auth/verify-account are
  // commented out on the backend. The /verify-account page is also
  // removed from the router. To re-enable, restore the implementations
  // below and uncomment the matching backend routes in authRoutes.js.

  const sendVerifyOtp = async (_email) => {
    return { success: false, message: 'Email verification is disabled — accounts are verified via Google.' };
  };
  /* --- original sendVerifyOtp implementation ---
  const sendVerifyOtp = async (email) => {
    try {
      const res = await axios.post(`${API}/api/auth/verify-otp`, { email }, { withCredentials: true })
      if (res.data.success) {
        return { success: true, message: res.data.message || 'OTP sent on given Account' }
      }
      return { success: false, message: res.data.message || 'Error sending otp' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Cannot send otp" };
    }
  };
  */

  const verifyAccount = async (_otp) => {
    return { success: false, message: 'Email verification is disabled — accounts are verified via Google.' };
  };
  /* --- original verifyAccount implementation ---
  const verifyAccount = async (otp) => {
    try {
      const res = await axios.post(`${API}/api/auth/verify-account`, { otp: otp }, { withCredentials: true })
      if (res.data.success) {
        return { success: true, message: res.data?.message || 'Account successfully verified' }
      }
      return { success: false, message: res.data?.message || "Error Verifying Account" }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Error Verifying Account" };
    }
  };
  */

  return(
    <AuthContext.Provider
    value={{
        user,
        setUser,
        authLoading,
        isAdmin,
        setIsAdmin,
        isAuthenticated: !!user,
        checkAuth,
        checkAdminAuth,
        login,
        signUp,
        logout,
        googleAuth,
        updateUserInfo,
        sendVerifyOtp,
        verifyAccount,
      }}
    >
        
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => useContext(AuthContext);