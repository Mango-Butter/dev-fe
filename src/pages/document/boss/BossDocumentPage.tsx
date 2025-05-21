import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import clsx from "clsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import BossContractListPage from "./BossContractListPage.tsx";
import BossDocumentEtcPage from "./BossDocumentEtcPage.tsx";

const tabItems = [
  { label: "근로계약서", value: "contract" },
  { label: "기타 문서", value: "etc" },
];

const BossDocumentPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "contract";
  const navigate = useNavigate();
  useLayout({
    title: "문서함",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate("/boss"),
    rightIcon: null,
  });

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
        {currentTab === "contract" && <BossContractListPage />}
        {currentTab === "etc" && <BossDocumentEtcPage />}
      </div>
    </div>
  );
};

export default BossDocumentPage;
