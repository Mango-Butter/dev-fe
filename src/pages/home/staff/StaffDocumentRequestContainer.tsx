import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStaffStoreStore from "../../../stores/useStaffStoreStore";
import { fetchStaffContracts } from "../../../api/staff/constract.ts";
import { getStaffDocumentSummary } from "../../../api/staff/document.ts";
import FullScreenLoading from "../../../components/common/FullScreenLoading.tsx";

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

        const unsignedCount = contracts.filter((c) => !c.isSigned).length;
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

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full justify-start items-center title-1">서류 요청</div>
      <div className="flex gap-2 w-full">
        <div
          onClick={() => navigate("/staff/document?type=contract")}
          className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">근로계약서</span>
          <span className="body-3 text-gray-500">
            서명 요청 {contractRequestCount}
          </span>
        </div>
        <div
          onClick={() => navigate("/staff/document?type=etc")}
          className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">기타 문서</span>
          <span className="body-3 text-gray-500">
            제출 요청 {documentRequestCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaffDocumentRequestContainer;
