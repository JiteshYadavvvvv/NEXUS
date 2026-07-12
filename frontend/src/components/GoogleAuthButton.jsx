import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const GoogleAuthButton = ({ onSuccess, onError }) => {
  const { googleAuth } = useAuth();
  const btnRef = useRef(null);

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
      if (!window.google?.accounts?.id || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 400,
      });
    };

    if (window.google?.accounts?.id) {
      init();
      return;
    }

    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", init);
    return () => script.removeEventListener("load", init);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div ref={btnRef} />
    </div>
  );
};

export default GoogleAuthButton;
