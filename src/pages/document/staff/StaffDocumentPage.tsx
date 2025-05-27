import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import clsx from "clsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import StaffContractListPage from "./StaffContractListPage.tsx";
import StaffDocumentListPage from "./StaffDocumentListPage.tsx";

const tabItems = [
  { label: "근로계약서", value: "contract" },
  { label: "기타 서류", value: "etc" },
];

const StaffDocumentPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "contract";
  const navigate = useNavigate();

  useLayout({
    title: "내 문서",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: true,
    onBack: () => navigate("/staff"),
    rightIcon: null,
  });

  useEffect(() => {
    if (!searchParams.get("type")) {
      setSearchParams({ type: "contract" });
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

      {/* 탭별 내용 영역 (API 연결 예정) */}
      <div className="p-4">
        {currentTab === "contract" && <StaffContractListPage />}
        {currentTab === "etc" && <StaffDocumentListPage />}
      </div>
    </div>
  );
};

export default StaffDocumentPage;
