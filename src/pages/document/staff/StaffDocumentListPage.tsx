import { useEffect } from "react";
import StaffDocumentCard from "./StaffDocumentCard.tsx";
import { useDocumentStore } from "../../../stores/staff/documentStore.ts";

const StaffDocumentListPage = () => {
  const { documents, loading, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-grayscale-500 body-3">
        제출 서류 목록을 불러오는 중입니다...
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-grayscale-500 body-3">
        제출해야 할 필수 서류가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-3 gap-3">
      {documents.map((doc) => (
        <StaffDocumentCard key={doc.documentType} document={doc} />
      ))}
    </div>
  );
};

export default StaffDocumentListPage;
