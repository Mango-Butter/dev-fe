import { useLayout } from "../../../hooks/useLayout.ts";
import Button from "../../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";

export const contractPage = [
  { contractId: 0, title: "망알바 근로계약서" },
  { contractId: 1, title: "고알바 근로계약서" },
  { contractId: 2, title: "심재엽 근로계약서" },
  { contractId: 3, title: "이명건 근로계약서", editable: true },
];

const ContractPage = () => {
  useLayout({
    title: "근로계약서 페이지",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate("/boss"),
    rightIcon: null,
  });

  const navigate = useNavigate();

  const navigateToTemplateRegister = () => {
    navigate("/contract/template/register");
  };

  const navigateToDetail = (contractId: number) => {
    navigate(`/contract/${contractId}`);
  };

  const handleClickDelete = (e: React.MouseEvent, contractId: number) => {
    e.stopPropagation();
    //Todo: contractId로 삭제
    console.log(contractId);
  };

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
        {contractPage.map(({ contractId, title, editable }) => (
          <div
            key={contractId}
            onClick={() => navigateToDetail(contractId)}
            className="cursor-pointer w-full px-4 py-6 bg-white rounded-xl shadow-[1px_1px_6px_0px_rgba(231,231,231,1.00)] inline-flex justify-start items-center"
          >
            <div className="flex-1 flex justify-between items-center">
              <div className="flex-1 justify-start text-grayscale-900 heading-2">
                {title}
              </div>
              {editable && (
                <div
                  className="text-right justify-center text-grayscale-500 body-1"
                  onClick={(e) => handleClickDelete(e, contractId)}
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

export default ContractPage;
