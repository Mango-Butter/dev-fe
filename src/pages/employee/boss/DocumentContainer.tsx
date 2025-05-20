import { useEffect, useState } from "react";
import { getStaffDocumentSummary } from "../../../api/boss/document";
import {
  StaffDocumentSummary,
  documentTypeLabelMap,
} from "../../../types/document";
import { BusinessOff } from "../../../components/icons/BusinessIcon.tsx";
import MailIcon from "../../../components/icons/MailIcon.tsx";

interface Props {
  storeId: number;
  staffId: number;
  onClickContract: () => void;
}

const DocumentContainer = ({ storeId, staffId, onClickContract }: Props) => {
  const [documents, setDocuments] = useState<StaffDocumentSummary[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getStaffDocumentSummary(storeId, staffId);
        const requiredDocs = res.filter((doc) => doc.isRequired);
        setDocuments(requiredDocs);
      } catch (err) {
        console.error("서류 현황 조회 실패", err);
      }
    };

    fetch();
  }, [storeId, staffId]);

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
          <span className="body-3 text-positive mt-1">작성완료</span>
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
