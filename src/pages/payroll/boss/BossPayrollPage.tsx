import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import clsx from "clsx";
import BossAutoTransferTab from "./autoTransfer/BossAutoTransferTab.tsx";
import BossPayrollHistoryTab from "./history/BossPayrollHistoryTab.tsx";
import BossWithhodingTab from "./withholding/BossWithhodingTab.tsx";
import BossWageTab from "./wage/BossWageTab.tsx";

const tabItems = [
  { label: "급여 내역", value: "history" },
  { label: "자동 송금", value: "autoTransfer" },
  { label: "공제 항목", value: "withholding" },
  { label: "시급 설정", value: "wage" },
];

const BossPayrollPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "history";

  useEffect(() => {
    if (!searchParams.get("type")) {
      setSearchParams({ type: "history" });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (type: string) => {
    setSearchParams({ type });
  };

  return (
    <div className="flex flex-col">
      {/* 탭 영역 */}
      <div className="grid grid-cols-4 border-b border-grayscale-200">
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
        {currentTab === "history" && <BossPayrollHistoryTab />}
        {currentTab === "autoTransfer" && <BossAutoTransferTab />}
        {currentTab === "withholding" && <BossWithhodingTab />}
        {currentTab === "wage" && <BossWageTab />}
      </div>
    </div>
  );
};

export default BossPayrollPage;
