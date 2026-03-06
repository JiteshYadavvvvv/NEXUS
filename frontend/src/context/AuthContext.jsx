import axios from "axios";
import { useEffect, useState, createContext, useContext } from "react";


const AuthContext = createContext();
const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
if (!import.meta.env.VITE_BACKEND_URL) {
  console.warn("AuthContext: VITE_BACKEND_URL is not defined in .env. Falling back to default URL.");
}
console.log("AuthContext: Backend API URL set to:", API);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
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

  useEffect(() => {
    checkAuth().finally(() => setAuthLoading(false));
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        const userInfo = await checkAuth();
        return { success: true, message: "Successfully Login", user: userInfo };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Sign Up
  const signUp = async (name, email, password, year) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/register`,
        {
          name: name,
          email: email,
          password: password,
          year: year,
        },
        { withCredentials: true },
      );
      if (res.data.success) {
        const userInfo = await checkAuth();
        return { success: true, message: "Signup Successful", user: userInfo };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

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
      const res = await fetch(`${API}/api/auth/update-user-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
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

    setUser(null);
  };

  // send verify account otp:
  const sendVerifyOtp = async (email) => {
    try {
      const res = await axios.post(`${API}/api/auth/verify-otp`, { email }, {
        withCredentials: true
      })
      if (res.data.success) {
        return { success: true, message: res.data.message || 'OTP sent on given Account' }
      }
      return { success: false, message: res.data.message || 'Error sending otp' }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Cannot send otp",
      };
    }
  }

  // verify account:
  const verifyAccount = async (otp) => {
    try {
      const res = await axios.post(`${API}/api/auth/verify-account`, {
        otp: otp
      }, { withCredentials: true })
      if (res.data.success) {
        return { success: true, message: res.data?.message || 'Account successfully verified' }
      }
      return { success: false, message: res.data?.message || "Error Verifying Account" }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error Verifying Account",
      };
    }
  }

  return(
    <AuthContext.Provider
    value={{
        user,
        authLoading,
        isAuthenticated: !!user,
        checkAuth,
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