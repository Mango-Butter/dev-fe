import { lazy } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: "ClockIcon" | "WingMoneyIcon" | "FolderIcon" | "DateIcon";
}

const icons = {
  ClockIcon: lazy(() => import("../../components/icons/ClockIcon")),
  WingMoneyIcon: lazy(() => import("../../components/icons/WingMoneyIcon")),
  FolderIcon: lazy(() => import("../../components/icons/FolderIcon")),
  DateIcon: lazy(() => import("../../components/icons/DateIcon")),
};

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  const IconComponent = icons[icon];

  return (
    <div className="p-5 bg-white rounded-xl flex flex-col justify-between items-end aspect-square w-[160px]">
      <div className="flex flex-col justify-start items-start gap-2">
        <div className="text-grayscale-900 title-1">{title}</div>
        <div className="text-grayscale-500 body-2 text-left">{description}</div>
      </div>
      <IconComponent />
    </div>
  );
};
