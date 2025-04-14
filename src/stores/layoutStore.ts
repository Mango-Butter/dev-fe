import { create } from "zustand";
import { ReactNode } from "react";

type HeaderTheme = "default" | "plain";

interface LayoutState {
  headerVisible: boolean;
  bottomNavVisible: boolean;
  title?: string;
  theme: HeaderTheme;
  rightIcon?: ReactNode;
  onBack?: () => void;
  setLayout: (options: {
    title?: string;
    theme?: HeaderTheme;
    headerVisible?: boolean;
    bottomNavVisible?: boolean;
    rightIcon?: ReactNode;
    onBack?: () => void;
  }) => void;
  resetLayout: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  headerVisible: true,
  bottomNavVisible: true,
  title: "",
  theme: "default",
  rightIcon: undefined,
  onBack: undefined,
  setLayout: ({
    title,
    theme = "default",
    headerVisible = true,
    bottomNavVisible = true,
    rightIcon,
    onBack,
  }) =>
    set({
      title,
      theme,
      headerVisible,
      bottomNavVisible,
      rightIcon,
      onBack,
    }),
  resetLayout: () =>
    set({
      headerVisible: true,
      bottomNavVisible: true,
      title: "",
      theme: "default",
      rightIcon: undefined,
      onBack: undefined,
    }),
}));
