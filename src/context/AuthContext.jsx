import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => ({
    token: sessionStorage.getItem("token"),
    tokenType: sessionStorage.getItem("tokenType"),
    id: sessionStorage.getItem("id"),
    email: sessionStorage.getItem("email"),
    role: sessionStorage.getItem("role"),
    employeeId: sessionStorage.getItem("employee_id"),
  }));

  const login = ({ token, tokenType, user }) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("tokenType", tokenType);
    sessionStorage.setItem("id", user.id);
    sessionStorage.setItem("email", user.email);
    sessionStorage.setItem("role", user.role);
    sessionStorage.setItem("employee_id", user.employee_id);

    setAuth({
      token,
      tokenType,
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id,
    });
  };

  const logout = () => {
    sessionStorage.clear();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
