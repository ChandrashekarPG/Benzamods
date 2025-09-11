// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // user object for regular users (normalized to have _id and role)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // admin object (kept separate)
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("admin");
    return saved ? JSON.parse(saved) : null;
  });

  // single token representing the currently active session (admin or user)
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loginRole, setLoginRole] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // keep localStorage synced
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (admin) localStorage.setItem("admin", JSON.stringify(admin));
    else localStorage.removeItem("admin");
  }, [admin]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // require user login for an action (like add to cart / enquiry)
  const requireUserLogin = (action) => {
    // if a user is present and a token exists, run the action immediately
    if (user && token) {
      action();
      return;
    }
    // otherwise open user login modal and save the action for later
    setLoginRole("user");
    setPendingAction(() => action);
  };

  // open login modal manually (from navbar buttons)
  const openLogin = (role = "user") => {
    setLoginRole(role);
  };

  // Called by LoginModal (via onSuccess) after a successful login
  // role: "user" | "admin"
  // loggedInObj: normalized user object ({ _id, name, email, role })
  // receivedToken: JWT string
// src/context/AuthContext.jsx

const handleLoginSuccess = (role, loggedInObj, receivedToken) => {
  const normalizedRole = String(role).toLowerCase();
  setToken(receivedToken || null);

  if (normalizedRole === "admin") {
    setAdmin(loggedInObj);
    // ✅ Show success alert for admin login
    alert("Login successful");
  } else {
    // user logged in
    setUser(loggedInObj);
    // ✅ Show success alert for user login
    alert("Login successful");

    // if there was a pending action (like addToCart), run it now
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        try {
          action();
        } catch (err) {
          console.error("Error running pending action after login:", err);
        }
      }, 50);
    }
  }

  setLoginRole(null); // hide modal
};

    

  const logoutUser = () => {
    setUser(null);
    // clear token (if you want to keep admin session when user logs out,
    // you'd need logic to restore adminToken here—left simple)
    setToken(null);
    localStorage.removeItem("user");
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        setUser,
        setAdmin,
        logoutUser,
        logoutAdmin,
        requireUserLogin,
        openLogin,
        handleLoginSuccess,
      }}
    >
      {children}

      {/* Login modal lives inside provider so requireUserLogin/openLogin works */}
      <LoginModal
        isOpen={!!loginRole}
        onClose={() => setLoginRole(null)}
        role={loginRole}
        onSuccess={(role, loggedInObj, receivedToken) =>
          handleLoginSuccess(role, loggedInObj, receivedToken)
        }
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

