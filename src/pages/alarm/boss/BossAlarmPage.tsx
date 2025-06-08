import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import clsx from "clsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import BossRequestTab from "./BossRequestTab.tsx";
import BossNotificationTab from "./BossNotificationTab.tsx";

const tabItems = [
  { label: "요청", value: "request" },
  { label: "알림", value: "notification" },
];

const BossAlarmPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "request";
  const navigate = useNavigate();

  useLayout({
    title: "요청 • 알림",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate("/boss", { replace: true }),
    rightIcon: null,
  });

  useEffect(() => {
    if (!searchParams.get("type")) {
      setSearchParams({ type: "request" });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (type: string) => {
    setSearchParams({ type });
  };

  return (
    <div className="flex flex-col">
      {/* 탭 영역 */}
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

      {/* 탭별 내용 영역 */}
      <div className="p-4">
        {currentTab === "request" && <BossRequestTab />}
        {currentTab === "notification" && <BossNotificationTab />}
      </div>
    </div>
  );
};

export default BossAlarmPage;
