// src/routes/AppInitializer.tsx
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { fetchUserProfile } from "../api/user";

const AppInitializer = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        try {
          const user = await fetchUserProfile();
          setUser(user);
        } catch (err) {
          console.warn("자동 로그인 실패", err);
        }
      }
    };

    init();
  }, [accessToken, setUser]);

  return null;
};

export default AppInitializer;
