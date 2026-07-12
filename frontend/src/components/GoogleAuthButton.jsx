import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const GoogleAuthButton = ({ onSuccess, onError, label = "Continue with Google" }) => {
  const { googleAuth } = useAuth();
  const googleBtnRef = useRef(null);

  const handleCredentialResponse = async (response) => {
    const result = await googleAuth(response.credential);
    if (result.success) {
      onSuccess?.(result);
    } else {
      onError?.(result.message);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("GoogleAuthButton: VITE_GOOGLE_CLIENT_ID is not set.");
      return;
    }

    const init = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: "standard",
          size: "large",
          width: 400,
        });
      }
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.addEventListener("load", init);
        return () => script.removeEventListener("load", init);
      }
    }
  }, []);

  const handleClick = () => {
    const inner = googleBtnRef.current?.querySelector("div[role='button']");
    if (inner) {
      inner.click();
    } else {
      onError?.("Google sign-in is not available. Please refresh.");
    }
  };

  return (
    <div className="w-full">
      {/* Google's button rendered off-screen — provides the real click target */}
      <div ref={googleBtnRef} style={{ position: "fixed", top: "-9999px", left: "-9999px" }} />
      <button
        type="button"
        onClick={handleClick}
        className="
          w-full flex items-center justify-center gap-3
          py-2.5 px-4 rounded-xl
          bg-white dark:bg-slate-800
          border border-slate-300 dark:border-slate-600
          text-slate-700 dark:text-slate-200
          text-sm font-medium
          shadow-sm hover:shadow-md
          hover:bg-slate-50 dark:hover:bg-slate-700
          active:scale-[0.98]
          transition-all duration-150
        "
      >
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.2 7.4-10.3 7.4-17.2z"/>
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8L32.2 36c-2.2 1.5-5 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.6v6.2C6.5 42.8 14.7 48 24 48z"/>
          <path fill="#FBBC05" d="M10.5 28.4c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7v-6.2H2.6C.9 16.3 0 20 0 24s.9 7.7 2.6 11.2l7.9-6.8z"/>
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.1 30.5 0 24 0 14.7 0 6.5 5.2 2.6 12.8l7.9 6.8C12.4 13.7 17.7 9.5 24 9.5z"/>
        </svg>
        {label}
      </button>
    </div>
  );
};

export default GoogleAuthButton;
