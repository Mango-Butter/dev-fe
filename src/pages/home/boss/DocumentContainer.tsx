// src/components/document/DocumentContainer.tsx
import DocumentCard from "./DocumentCard";
import { BusinessOff } from "../../../components/icons/BusinessIcon.tsx";
import MailIcon from "../../../components/icons/MailIcon.tsx";

const DocumentContainer = () => {
  return (
    <div className="flex flex-col w-full pb-4">
      <p className="title-1 mb-3">문서함</p>
      <div className="grid grid-cols-2 gap-3">
        <DocumentCard
          icon={<BusinessOff />}
          title="근로계약서"
          description={`알바생 별 근로계약서를\n한 눈에 확인해 보세요`}
          to="/boss/document?type=contract"
        />
        <DocumentCard
          icon={<MailIcon />}
          title="기타 문서"
          description={`필수 문서들을\n관리 해 보세요`}
          to="/boss/document?type=etc"
        />
      </div>
    </div>
  );
};

export default DocumentContainer;
