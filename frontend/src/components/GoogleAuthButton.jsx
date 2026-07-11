import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * GoogleAuthButton
 *
 * Props:
 *  - onSuccess(data)  → called with { success, user, message } after backend responds
 *  - onError(msg)     → called with a string on failure (optional)
 *  - label            → button text override (default "Continue with Google")
 */
const GoogleAuthButton = ({ onSuccess, onError, label = "Continue with Google" }) => {
  const { googleAuth } = useAuth();
  const btnRef = useRef(null);

  const handleCredentialResponse = async (response) => {
    const token = response.credential;
    const result = await googleAuth(token);
    if (result.success) {
      onSuccess && onSuccess(result);
    } else {
      onError && onError(result.message);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("GoogleAuthButton: VITE_GOOGLE_CLIENT_ID is not set.");
      return;
    }

    const initGoogle = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: "popup",
        use_fedcm_for_prompt: true,
      });
    };

    // If script already loaded
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      // Wait for script to load
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (script) {
        script.addEventListener("load", initGoogle);
        return () => script.removeEventListener("load", initGoogle);
      }
    }
  }, []);

  const handleClick = () => {
    if (!window.google?.accounts?.id) {
      onError && onError("Google sign-in is not available. Please refresh.");
      return;
    }
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isDismissedMoment()) {
        // Fallback: render the button programmatically
        if (btnRef.current) {
          window.google.accounts.id.renderButton(btnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            width: btnRef.current.offsetWidth,
          });
          // Auto-click the rendered button
          const inner = btnRef.current.querySelector("div[role='button']");
          if (inner) inner.click();
        }
      }
    });
  };

  return (
    <div ref={btnRef} className="w-full">
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
        {/* Google 'G' SVG */}
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#4285F4"
            d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.2 7.4-10.3 7.4-17.2z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.5 0 11.9-2.1 15.9-5.8L32.2 36c-2.2 1.5-5 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.6v6.2C6.5 42.8 14.7 48 24 48z"
          />
          <path
            fill="#FBBC05"
            d="M10.5 28.4c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7v-6.2H2.6C.9 16.3 0 20 0 24s.9 7.7 2.6 11.2l7.9-6.8z"
          />
          <path
            fill="#EA4335"
            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.1 30.5 0 24 0 14.7 0 6.5 5.2 2.6 12.8l7.9 6.8C12.4 13.7 17.7 9.5 24 9.5z"
          />
        </svg>
        {label}
      </button>
    </div>
  );
};

export default GoogleAuthButton;
