import { useState } from "react";
import {
  StaffDocumentSummary,
  documentLabelMap,
} from "../../../types/document";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import Button from "../../../components/common/Button.tsx";
import FileDropzone from "../../../components/common/FileDropzone.tsx";
import { compressImageIfNeeded } from "../../../utils/compressImageIfNeeded.ts";
import { fileToBase64 } from "../../../utils/fileToBase64.ts";
import { encryptSignatureBase64 } from "../../../libs/encryption.ts";
import { uploadStaffDocument } from "../../../api/staff/document.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { useDocumentStore } from "../../../stores/staff/documentStore.ts";
import { toast } from "react-toastify";

interface Props {
  document: StaffDocumentSummary;
}

const DocumentSubmitBottomSheetContent = ({ document }: Props) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore } = useStaffStoreStore();
  const { fetchDocuments } = useDocumentStore();

  const handleConfirm = async () => {
    if (!selectedStore) {
      toast.error("매장을 찾을 수 없습니다.");
      return;
    }
    if (!uploadedFile) {
      toast.error("파일을 등록해주세요.");
      return;
    }

    try {
      const compressed = await compressImageIfNeeded(uploadedFile);
      const base64 = await fileToBase64(compressed); // data:image/... 형식
      const encrypted = encryptSignatureBase64(base64);

      await uploadStaffDocument(selectedStore.storeId, {
        documentType: document.documentType,
        documentData: encrypted,
      });
      await fetchDocuments();

      toast.success("제출이 완료되었습니다.");
      setBottomSheetOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FileDropzone
        file={uploadedFile}
        onChange={(file) => setUploadedFile(file)}
        placeholder={`${documentLabelMap[document.documentType]}을 등록해주세요.`}
      />
      <Button theme="secondary" onClick={handleConfirm}>
        확인
      </Button>
    </div>
  );
};

export default DocumentSubmitBottomSheetContent;
