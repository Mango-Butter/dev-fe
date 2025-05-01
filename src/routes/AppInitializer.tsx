import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { fetchUserProfile } from "../api/user";

const AppInitializer = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        try {
          const user = await fetchUserProfile();
          setUser(user);
        } catch (err) {
          logout();
          navigate("/login", { replace: true });
        }
      }
    };

    init();
  }, [accessToken, logout, navigate, setUser]);

  return null;
};

export default AppInitializer;
