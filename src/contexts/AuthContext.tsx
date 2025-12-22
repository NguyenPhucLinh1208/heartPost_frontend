// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { authService } from "@/services/authService";
// import { LoginCredentials, User, UserCreate } from "@/types/auth";

// // Define the shape of the context's value
// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   register: (userData: UserCreate) => Promise<void>;
//   logout: () => void;
//   refreshUser: () => Promise<void>; // New function
// }

// // Create the context with a default undefined value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define the props for the provider component
// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchUser = async (currentToken: string) => {
//       try {
//         const userData = await authService.getMe(currentToken);
//         setUser(userData);
//       } catch (error) {
//         console.error("Session expired or token is invalid.", error);
//         localStorage.removeItem("authToken");
//         setToken(null);
//         setUser(null);
//       }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const storedToken = localStorage.getItem("authToken");
//       if (storedToken) {
//         setToken(storedToken);
//         await fetchUser(storedToken);
//       }
//       setIsLoading(false);
//     };

//     initializeAuth();

//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === "authToken") {
//         if (event.newValue === null && event.oldValue) {
//           // Token was removed, log out from this tab as well
//           logout();
//         }
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   const login = async (credentials: LoginCredentials) => {
//     const { access_token } = await authService.login(credentials);
//     localStorage.setItem("authToken", access_token);
//     setToken(access_token);
//     await fetchUser(access_token);
//   };

//   const register = async (userData: UserCreate) => {
//     await authService.register(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     setUser(null);
//     setToken(null);
//   };

//   const refreshUser = async () => {
//     if (token) {
//         await fetchUser(token);
//     }
//   };

//   const value = {
//     user,
//     token,
//     isAuthenticated: !!token,
//     isLoading,
//     login,
//     register,
//     logout,
//     refreshUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook to use the auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
// import { authService } from "@/services/authService"; // Tạm thời comment service thật
import { LoginCredentials, User, UserCreate } from "@/types/auth";

// --- MOCK DATA (Dữ liệu giả để Bypass) ---
const MOCK_USER: any = {
  id: "dev_user_123",
  email: "developer@heartpost.com",
  full_name: "Developer Mode",
  is_active: true,
  is_superuser: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_TOKEN = "bypass_dev_token_secret";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 1. KHỞI TẠO STATE VỚI DỮ LIỆU GIẢ LUÔN (Thay vì null)
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [token, setToken] = useState<string | null>(MOCK_TOKEN);
  
  // 2. Tắt chế độ loading ngay lập tức
  const [isLoading, setIsLoading] = useState(false);

  // --- Fake Functions (Để bấm nút không bị lỗi crash app) ---

  const login = async (credentials: LoginCredentials) => {
    console.log("DEV MODE: Fake Login Success", credentials);
    setUser(MOCK_USER);
    setToken(MOCK_TOKEN);
    localStorage.setItem("authToken", MOCK_TOKEN);
  };

  const register = async (userData: UserCreate) => {
    console.log("DEV MODE: Fake Register Success", userData);
    // FIX: Đổi 'username' thành 'email' để khớp với LoginCredentials interface
    login({ email: userData.email, password: "password" });
  };

  const logout = () => {
    console.log("DEV MODE: Logout");
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const refreshUser = async () => {
    console.log("DEV MODE: Refresh User");
    setUser(MOCK_USER);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token, // Sẽ luôn là true nếu có token giả
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};