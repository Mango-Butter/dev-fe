import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStaffStoreStore from "../../../stores/useStaffStoreStore";
import { fetchStaffContracts } from "../../../api/staff/constract.ts";
import { getStaffDocumentSummary } from "../../../api/staff/document.ts";
import FullScreenLoading from "../../../components/common/FullScreenLoading.tsx";
import { cn } from "../../../libs";

const StaffDocumentRequestContainer = () => {
  const navigate = useNavigate();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;

  const [contractRequestCount, setContractRequestCount] = useState(0);
  const [documentRequestCount, setDocumentRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;

      try {
        const [contracts, documents] = await Promise.all([
          fetchStaffContracts(storeId),
          getStaffDocumentSummary(storeId),
        ]);

        const unsignedCount = contracts.filter(
          (c) => c.status === "PENDING_STAFF_SIGNATURE",
        ).length;
        const unsubmittedRequiredDocs = documents.filter(
          (d) => d.isRequired && !d.isSubmitted,
        ).length;

        setContractRequestCount(unsignedCount);
        setDocumentRequestCount(unsubmittedRequiredDocs);
      } catch (err) {
        console.error("서류 요청 정보 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  if (loading) return <FullScreenLoading />;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full justify-start items-center title-1">서류 요청</div>
      <div className="flex gap-2 w-full">
        {/* 근로계약서 카드 */}
        <div
          onClick={() => navigate("/staff/document?type=contract")}
          className={cn(
            "cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white rounded-xl flex-col justify-center items-start gap-2 self-stretch",
            contractRequestCount > 0 ? "shadow-blue-shadow" : "shadow-basic",
          )}
        >
          <span className="title-2">근로계약서</span>
          <span
            className={cn(
              "body-3",
              contractRequestCount > 0
                ? "text-secondary-600"
                : "text-grayscale-500",
            )}
          >
            서명 요청 {contractRequestCount}
          </span>
        </div>

        {/* 기타 서류 카드 */}
        <div
          onClick={() => navigate("/staff/document?type=etc")}
          className={cn(
            "cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white rounded-xl flex-col justify-center items-start gap-2 self-stretch",
            documentRequestCount > 0 ? "shadow-blue-shadow" : "shadow-basic",
          )}
        >
          <span className="title-2">기타 서류</span>
          <span
            className={cn(
              "body-3",
              documentRequestCount > 0
                ? "text-secondary-600"
                : "text-grayscale-500",
            )}
          >
            제출 요청 {documentRequestCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaffDocumentRequestContainer;
