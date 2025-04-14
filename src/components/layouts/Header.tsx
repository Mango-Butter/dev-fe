// src/components/layouts/Header.tsx
import { useUserStore } from "../../stores/userStore";

const Header = () => {
  const user = useUserStore((state) => state.user);

  return (
    <header className="h-14 flex items-center justify-center bg-gray-200 text-black text-lg font-bold">
      망고보스{user?.name ? ` (${user.name})` : ""}
    </header>
  );
};

export default Header;
