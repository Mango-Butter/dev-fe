import { useSearchParams } from "react-router-dom";
import clsx from "clsx";

const tabItems = [
  { label: "근무", value: "attendance" },
  { label: "서류", value: "document" },
];

const BossEmployeeTabBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "attendance";

  const handleTabChange = (type: string) => {
    setSearchParams({ type });
  };

  return (
    <div className="grid grid-cols-2 border-b border-grayscale-200">
      {tabItems.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabChange(tab.value)}
          className={clsx(
            "py-3 text-center body-2",
            currentTab === tab.value
              ? "text-grayscale-900 border-b-2 border-black font-semibold"
              : "text-grayscale-400",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default BossEmployeeTabBar;
