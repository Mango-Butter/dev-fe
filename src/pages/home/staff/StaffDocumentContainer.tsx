import { useEffect, useState } from "react";
import { getStaffDocumentSummary } from "../../../api/staff/document";
import { fetchStaffContracts } from "../../../api/staff/constract.ts";
import {
  StaffDocumentSummary,
  documentTypeLabelMap,
} from "../../../types/document";
import { StaffContractSummary } from "../../../types/contract";
import MailIcon from "../../../components/icons/MailIcon.tsx";
import { BusinessOff } from "../../../components/icons/BusinessIcon.tsx";
import useStoreStore from "../../../stores/storeStore";
import { useNavigate } from "react-router-dom";

const StaffDocumentContainer = () => {
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const [documents, setDocuments] = useState<StaffDocumentSummary[]>([]);
  const [contracts, setContracts] = useState<StaffContractSummary[]>([]);

  useEffect(() => {
    if (!storeId) return;

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

  const handleClickContract = () => {
    navigate("/staff/contract");
  };

  // 상태별 계약서 수 계산
  const contractCounts = contracts.reduce(
    (acc, contract) => {
      if (contract.isSigned) {
        acc.COMPLETED++;
      } else {
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
    <div>
      <p className="title-1 mb-3">제출 서류 현황</p>
      <div className="grid grid-cols-2 gap-3">
        {/* 근로계약서 카드 */}
        <div
          className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
          onClick={handleClickContract}
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

        {/* 제출 서류 카드 */}
        {documents.map((doc) => (
          <div
            key={doc.documentType}
            className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
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
    </div>
  );
};

export default StaffDocumentContainer;
