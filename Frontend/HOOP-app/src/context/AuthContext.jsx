import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../api/auth.api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await getProfile();
      // data.user should contain the profile and roles (e.g. ['user', 'admin'])
      setUser(data.user);
      setRoles(data.user?.roles || []);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginContext = (userData) => {
    setUser(userData);
    setRoles(userData?.roles || []);
  };

  const logoutContext = () => {
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, loading, fetchUser, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};
