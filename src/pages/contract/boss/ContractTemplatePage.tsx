import { useEffect, useState } from "react";
import { useLayout } from "../../../hooks/useLayout.ts";
import Button from "../../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";
import { fetchContractTemplateList } from "../../../api/boss/contractTemplate.ts";
import { ContractTemplateSummary } from "../../../types/contractTemplate.ts";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import useStoreStore from "../../../stores/storeStore.ts";

const ContractTemplatePage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ContractTemplateSummary[]>([]);
  const { selectedStore } = useStoreStore();

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!selectedStore) return;
      try {
        const storeId = selectedStore.storeId;
        const { result } = await fetchContractTemplateList(storeId);
        setTemplates(result);
      } catch (error) {
        console.error("템플릿 목록 불러오기 실패:", error);
      }
    };

    fetchTemplates();
  }, []);

  const navigateToTemplateRegister = () => {
    navigate("/boss/contract/template/register");
  };

  const navigateToTemplateView = (templateId: number) => {
    navigate(`/boss/contract/template/${templateId}`);
  };

  const navigateToDetail = (e: React.MouseEvent, templateId: number) => {
    e.stopPropagation();
    navigate(`/boss/contract/template/register?templateId=${templateId}`);
  };

  // ✅ 레이아웃 설정
  useLayout({
    title: "근로계약서 템플릿",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate("/boss/document?type=contract"),
    rightIcon: null,
  });

  return (
    <div className="h-full w-full px-5 py-6 inline-flex flex-col justify-start items-end gap-8">
      <Button
        size="md"
        theme="outline"
        type="button"
        state="default"
        className="text-black"
        onClick={navigateToTemplateRegister}
      >
        템플릿 추가하기
      </Button>

      <div className="w-full flex flex-col gap-4 justify-start items-center">
        {templates.length === 0 ? (
          <div className="w-full flex flex-col justify-center items-center gap-4 py-16">
            <ErrorIcon className="w-12 h-12" />
            <div className="text-center text-grayscale-800 body-3 w-full">
              근로계약서 템플릿이 존재하지 않습니다.
              <br />
              템플릿을 추가하여 미리 근로계약서를 작성해 보세요.
            </div>
          </div>
        ) : (
          templates.map(({ templateId, title }) => (
            <div
              key={templateId}
              onClick={() => navigateToTemplateView(templateId)}
              className="cursor-pointer w-full px-4 py-6 bg-white rounded-xl shadow-[1px_1px_6px_0px_rgba(231,231,231,1.00)] inline-flex justify-start items-center"
            >
              <div className="flex-1 flex justify-between items-center">
                <div className="flex-1 justify-start text-grayscale-900 heading-2">
                  {title}
                </div>
                <div
                  className="text-right justify-center text-grayscale-500 body-1"
                  onClick={(e) => navigateToDetail(e, templateId)}
                >
                  편집
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContractTemplatePage;
