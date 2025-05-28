import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "./Checkbox";
import { LucideInfo } from "lucide-react";

const meta: Meta<typeof Checkbox> = {
  title: "Common/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    onChange: { action: "checkbox toggled" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "이용약관 동의",
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "개인정보 수집 및 이용 동의",
    checked: true,
  },
};

export const Required: Story = {
  args: {
    label: "위치 정보 제공 동의",
    checked: true,
    required: true,
  },
};

export const Optional: Story = {
  args: {
    label: "마케팅 수신 동의",
    checked: false,
    optional: true,
  },
};

export const WithDescriptionAndIcon: Story = {
  args: {
    label: "카메라 접근 권한 동의",
    description: "근태 인증 및 프로필 이미지 등록에 사용됩니다.",
    checked: true,
    icon: <LucideInfo className="text-blue-500 ml-auto" />,
  },
};
