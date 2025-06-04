import { useEffect, useState } from "react";
import { getStaffDocumentSummary } from "../../../api/staff/document.ts";
import { fetchStaffContracts } from "../../../api/staff/constract.ts";
import {
  StaffDocumentSummary,
  documentTypeLabelMap,
} from "../../../types/document.ts";
import { StaffContractSummary } from "../../../types/contract.ts";
import MailIcon from "../../../components/icons/MailIcon.tsx";
import { BusinessOff } from "../../../components/icons/BusinessIcon.tsx";
import { useNavigate } from "react-router-dom";
import { isValidStoreId } from "../../../utils/store.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";

const StaffDocumentContainer = () => {
  const navigate = useNavigate();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;

  const [documents, setDocuments] = useState<StaffDocumentSummary[]>([]);
  const [contracts, setContracts] = useState<StaffContractSummary[]>([]);
  const isDocsCountZero = documents.length + contracts.length === 0;

  useEffect(() => {
    if (!isValidStoreId(storeId)) return;

    const fetch = async () => {
      try {
        const [docs, contractData] = await Promise.all([
          getStaffDocumentSummary(storeId),
          fetchStaffContracts(storeId),
        ]);
        setDocuments(docs.filter((doc) => doc.isRequired));
        setContracts(contractData);
      } catch (err) {
        console.error("서류 또는 계약서 조회 실패", err);
      }
    };

    fetch();
  }, [storeId]);

  // 상태별 계약서 수 계산
  const contractCounts = contracts.reduce(
    (acc, contract) => {
      if (contract.status === "COMPLETED") {
        acc.COMPLETED++;
      } else if (contract.status === "PENDING_STAFF_SIGNATURE") {
        acc.NOT_SIGNED++;
      }
      return acc;
    },
    {
      COMPLETED: 0,
      NOT_SIGNED: 0,
    },
  );

  return (
    <div className="flex flex-col gap-3 w-full mb-6">
      <p className="title-1">내가 제출한 서류</p>
      {isDocsCountZero ? (
        <div className="text-center text-grayscale-400 body-3 py-4 shadow-basic rounded-lg">
          제출한 서류가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* 근로계약서 카드 */}
          {contracts.length > 0 && (
            <div
              className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
              onClick={() => navigate(`/staff/document?type=contract`)}
            >
              <BusinessOff />
              <p>근로계약서</p>
              <div className="flex w-full items-center justify-center gap-1 mt-1">
                {contractCounts.COMPLETED > 0 && (
                  <span className="body-3 text-positive">
                    작성완료 {contractCounts.COMPLETED}
                  </span>
                )}
                {contractCounts.NOT_SIGNED > 0 && (
                  <span className="body-3 text-warning">
                    미작성 {contractCounts.NOT_SIGNED}
                  </span>
                )}
              </div>
            </div>
          )}
          {/* 제출 서류 카드 */}
          {documents.map((doc) => (
            <div
              key={doc.documentType}
              className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
              onClick={() => navigate(`/staff/document?type=etc`)}
            >
              <MailIcon />
              <p>{documentTypeLabelMap[doc.documentType]}</p>
              <span
                className={`body-3 mt-1 ${
                  doc.isSubmitted ? "text-positive" : "text-warning"
                }`}
              >
                {doc.isSubmitted ? "제출 완료" : "미제출"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDocumentContainer;
