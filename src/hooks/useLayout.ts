import { useEffect } from "react";
import { ReactNode } from "react";
import { useLayoutStore } from "../stores/layoutStore.ts";

interface UseLayoutOptions {
  title?: string;
  theme?: "default" | "plain";
  headerVisible?: boolean;
  bottomNavVisible?: boolean;
  rightIcon?: ReactNode;
  onBack?: () => void;
}

export const useLayout = ({
  title,
  theme = "default",
  headerVisible = true,
  bottomNavVisible = true,
  rightIcon,
  onBack,
}: UseLayoutOptions) => {
  const setLayout = useLayoutStore((state) => state.setLayout);

  useEffect(() => {
    setLayout({
      title,
      theme,
      headerVisible,
      bottomNavVisible,
      rightIcon,
      onBack,
    });

    return () => {
      setLayout({
        title: "",
        theme: "default",
        headerVisible: true,
        bottomNavVisible: true,
        rightIcon: undefined,
        onBack: undefined,
      });
    };
  }, [
    title,
    theme,
    headerVisible,
    bottomNavVisible,
    rightIcon,
    onBack,
    setLayout,
  ]);
};
