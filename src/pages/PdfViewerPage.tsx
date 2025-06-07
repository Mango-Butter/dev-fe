import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLayout } from "../hooks/useLayout.ts";

const PdfViewerPage = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const encodedUrl = searchParams.get("url");

  useLayout({
    title: "PDF로 보기",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
  });

  useEffect(() => {
    if (!encodedUrl) {
      setIsLoading(false);
      return;
    }

    const decoded = decodeURIComponent(encodedUrl);
    setUrl(decoded);
    setIsLoading(false);
  }, [encodedUrl]);

  if (isLoading) {
    return (
      <div className="p-4 text-center">📄 문서를 불러오는 중입니다...</div>
    );
  }

  if (!url) {
    return (
      <div className="p-4 text-center text-red-500">
        유효하지 않은 문서 URL입니다. 다시 시도해주세요.
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title="PDF 문서"
      className="w-full h-[calc(100vh-56px)]"
    />
  );
};

export default PdfViewerPage;
