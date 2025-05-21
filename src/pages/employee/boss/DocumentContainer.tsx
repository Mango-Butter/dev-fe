import { useEffect, useState } from "react";
import { getStaffDocumentSummary } from "../../../api/boss/document";
import { fetchBossStaffContracts } from "../../../api/boss/contract";
import {
  StaffDocumentSummary,
  documentTypeLabelMap,
} from "../../../types/document";
import { BossStaffContractSummary } from "../../../types/contract";
import { BusinessOff } from "../../../components/icons/BusinessIcon.tsx";
import MailIcon from "../../../components/icons/MailIcon.tsx";

interface Props {
  storeId: number;
  staffId: number;
  onClickContract: () => void;
}

const DocumentContainer = ({ storeId, staffId, onClickContract }: Props) => {
  const [documents, setDocuments] = useState<StaffDocumentSummary[]>([]);
  const [contracts, setContracts] = useState<BossStaffContractSummary[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [docs, contractData] = await Promise.all([
          getStaffDocumentSummary(storeId, staffId),
          fetchBossStaffContracts(storeId, staffId),
        ]);
        setDocuments(docs.filter((doc) => doc.isRequired));
        setContracts(contractData);
      } catch (err) {
        console.error("서류 또는 계약서 조회 실패", err);
      }
    };

    fetch();
  }, [storeId, staffId]);

  // 상태별 카운트 계산
  const contractCounts = contracts.reduce(
    (acc, contract) => {
      acc[contract.status]++;
      return acc;
    },
    {
      COMPLETED: 0,
      PENDING_STAFF_SIGNATURE: 0,
      NOT_CREATED: 0,
    },
  );

  return (
    <div>
      <p className="title-1 mb-3">근무 서류 관리</p>
      <div className="grid grid-cols-2 gap-3">
        {/* 근로계약서 카드 */}
        <div
          className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
          onClick={onClickContract}
        >
          <BusinessOff />
          <p>근로계약서</p>
          <div className="flex w-full items-center justify-center gap-1 mt-1">
            {contractCounts.COMPLETED > 0 && (
              <span className="body-3 text-positive">
                작성완료 {contractCounts.COMPLETED}
              </span>
            )}
            {contractCounts.PENDING_STAFF_SIGNATURE > 0 && (
              <span className="body-3 text-delay">
                서명대기 {contractCounts.PENDING_STAFF_SIGNATURE}
              </span>
            )}
            {contractCounts.NOT_CREATED > 0 && (
              <span className="body-3 text-warning">
                미작성 {contractCounts.NOT_CREATED}
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

export default DocumentContainer;
