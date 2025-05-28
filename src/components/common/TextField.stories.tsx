import type { Meta, StoryObj } from "@storybook/react";
import TextField from "./TextField";
import { Eye } from "lucide-react";

const meta: Meta<typeof TextField> = {
  title: "Common/TextField",
  component: TextField,
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["none", "warning", "correct", "active", "disable"],
    },
    size: {
      control: "select",
      options: ["lg", "md", "sm"],
    },
    theme: {
      control: "select",
      options: ["basic", "suffix", "icon"],
    },
    handleIconClick: { action: "icon clicked" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Basic: Story = {
  args: {
    title: "이름",
    placeholder: "이름을 입력하세요",
    state: "none",
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    title: "이메일",
    placeholder: "이메일을 입력하세요",
    state: "warning",
    helperText: "이메일 형식이 올바르지 않습니다",
  },
};

export const WithSuffix: Story = {
  args: {
    title: "가격",
    placeholder: "0",
    suffix: "원",
    theme: "suffix",
  },
};

export const WithIcon: Story = {
  args: {
    title: "비밀번호",
    placeholder: "비밀번호를 입력하세요",
    icon: <Eye />,
    theme: "icon",
  },
};

export const Disabled: Story = {
  args: {
    title: "전화번호",
    value: "010-1234-5678",
    state: "disable",
  },
};
