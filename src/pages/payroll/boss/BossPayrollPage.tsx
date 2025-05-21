import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import clsx from "clsx";
import BossPayrollTab from "./BossPayrollTab.tsx";

const tabItems = [
  { label: "급여", value: "payroll" },
  { label: "공제 항목", value: "withholding" },
  { label: "급여명세서", value: "paystub" },
];

const BossPayrollPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "payroll";

  useEffect(() => {
    if (!searchParams.get("type")) {
      setSearchParams({ type: "payroll" });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (type: string) => {
    setSearchParams({ type });
  };

  return (
    <div className="flex flex-col">
      {/* 탭 영역 */}
      <div className="grid grid-cols-3 border-b border-grayscale-200">
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

      {/* 탭별 내용 영역 */}
      <div className="p-5">
        {currentTab === "payroll" && <BossPayrollTab />}
        {currentTab === "withholding" && <div>공제항목</div>}
        {currentTab === "paystub" && <div>급여명세서</div>}
      </div>
    </div>
  );
};

export default BossPayrollPage;
