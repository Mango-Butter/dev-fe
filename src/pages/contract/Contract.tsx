import { useLayout } from "../../hooks/useLayout";
import Button from "../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";

export const contractTemplates = [
  { id: "standard", title: "망고보스 표준 근로계약서" },
  { id: "daily", title: "망고보스 일용직 근로계약서" },
  { id: "student", title: "망고보스 학생 근로계약서" },
  { id: "starbucks", title: "스타벅스 아주대점 근로계약서", editable: true },
];

const ContractPage = () => {
  useLayout({
    title: "근로계약서",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

  const navigate = useNavigate();

  return (
    <div className="h-full w-full px-5 py-6 inline-flex flex-col justify-start items-end gap-8">
      <Button
        size="md"
        theme="outline"
        type="button"
        state="default"
        className="text-black"
        onClick={() => navigate("/contract/register")}
      >
        근로계약서 템플릿 작성하기
      </Button>

      <div className="w-full flex flex-col gap-4 justify-start items-center">
        {contractTemplates.map(({ id, title, editable }) => (
          <div
            key={id}
            onClick={() => navigate(`/contract/${id}`)}
            className="cursor-pointer w-full px-4 py-6 bg-white rounded-xl shadow-[1px_1px_6px_0px_rgba(231,231,231,1.00)] inline-flex justify-start items-center"
          >
            <div className="flex-1 flex justify-between items-center">
              <div className="flex-1 justify-start text-grayscale-900 heading-2">
                {title}
              </div>
              {editable && (
                <div className="text-right justify-center text-grayscale-500 body-1">
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

export default ContractPage;
