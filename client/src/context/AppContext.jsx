import { createContext, useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const loadCreditsData = useCallback(async () => {
    try {
      if (!token) return;
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      } else if (data.message && data.message.toLowerCase().includes("not authorized")) {
        logout();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) logout();
      toast.error("Failed to load credits");
    }
  }, [token, backendUrl]);

  const refreshUser = useCallback(() => {
    loadCreditsData();
    navigate(0); // Hard refresh for full reload
  }, [loadCreditsData, navigate]);

  const generateImage = useCallback(async (prompt) => {
    try {
      if (!token) return;
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        loadCreditsData();
        toast.success(data.message);
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();
        if (data.creditBalance === 0) {
          navigate("/buy");
          toast.error("No credit balance");
        }
      }
    } catch (error) {
      toast.error("Failed to generate image");
    }
  }, [token, backendUrl, loadCreditsData, navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(false);
    navigate(0); // Hard refresh on logout
  }, [navigate]);

  useEffect(() => {
    if (token) loadCreditsData();
  }, [token, loadCreditsData]);

  const value = useMemo(() => ({
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
    refreshUser,
  }), [
    user, setUser, showLogin, setShowLogin, backendUrl, token, setToken, credit, setCredit,
    loadCreditsData, logout, generateImage, refreshUser
  ]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
