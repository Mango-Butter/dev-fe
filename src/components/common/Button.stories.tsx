import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";
import { LucideHome } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    theme: {
      control: "select",
      options: ["primary", "secondary", "ghost", "ghost2", "outline", "text"],
    },
    size: {
      control: "select",
      options: [
        "xl",
        "lg",
        "md",
        "sm",
        "icon_xl",
        "icon_lg",
        "icon_md",
        "icon_sm",
      ],
    },
    state: {
      control: "select",
      options: ["default", "active", "disabled"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "기본 버튼",
    theme: "primary",
    size: "md",
    state: "default",
  },
};

export const WithIcon: Story = {
  args: {
    children: "홈",
    theme: "secondary",
    size: "lg",
    icon: <LucideHome />,
    state: "default",
  },
};

export const Disabled: Story = {
  args: {
    children: "비활성화",
    theme: "ghost",
    size: "md",
    state: "disabled",
  },
};

export const IconOnly: Story = {
  args: {
    icon: <LucideHome />,
    theme: "outline",
    size: "icon_md",
    state: "default",
  },
};
