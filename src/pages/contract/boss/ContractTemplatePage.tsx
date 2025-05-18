import { useLayout } from "../../../hooks/useLayout.ts";
import Button from "../../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";

export const contractTemplates = [
  { id: 0, title: "망고보스 표준 근로계약서" },
  { id: 1, title: "망고보스 일용직 근로계약서" },
  { id: 2, title: "망고보스 학생 근로계약서" },
  { id: 3, title: "스타벅스 아주대점 근로계약서", editable: true },
];

const ContractTemplatePage = () => {
  const navigate = useNavigate();

  const navigateToTemplateRegister = () => {
    navigate("/contract/template/register");
  };

  const navigateToRegister = (templateId: number) => {
    navigate(`/contract/register?template=${templateId}`);
  };

  const navigateToEdit = (e: React.MouseEvent, templateId: number) => {
    e.stopPropagation();
    navigate(`/contract/template/${templateId}`);
  };

  // ✅ 레이아웃 설정
  useLayout({
    title: "근로계약서 템플릿",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate("/boss/contract"),
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
        템플릿 작성하기
      </Button>

      <div className="w-full flex flex-col gap-4 justify-start items-center">
        {contractTemplates.map(({ id, title, editable }) => (
          <div
            key={id}
            onClick={() => navigateToRegister(id)}
            className="cursor-pointer w-full px-4 py-6 bg-white rounded-xl shadow-[1px_1px_6px_0px_rgba(231,231,231,1.00)] inline-flex justify-start items-center"
          >
            <div className="flex-1 flex justify-between items-center">
              <div className="flex-1 justify-start text-grayscale-900 heading-2">
                {title}
              </div>
              {editable && (
                <div
                  className="text-right justify-center text-grayscale-500 body-1"
                  onClick={(e) => navigateToEdit(e, id)}
                >
                  편집
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractTemplatePage;
