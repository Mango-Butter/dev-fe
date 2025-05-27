import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStoreStore from "../../../stores/storeStore";
import Button from "../../../components/common/Button.tsx";
import { BossContractSummary } from "../../../types/contract.ts";
import ContractContainer from "../../contract/boss/ContractContainer.tsx"; // 변경된 부분
import { fetchBossContractList } from "../../../api/boss/contract.ts";

const BossContractListPage = () => {
  const { selectedStore } = useStoreStore();
  const [contracts, setContracts] = useState<BossContractSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchContracts = async () => {
    if (!selectedStore) return;
    try {
      setLoading(true); // optional: 로딩 표시
      const result = await fetchBossContractList(selectedStore.storeId);
      setContracts(result);
    } catch (err) {
      console.error("계약서 목록 조회 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [selectedStore]);

  const handleDelete = () => {
    fetchContracts();
  };

  const redirectContractTemplateListPage = () => {
    navigate("/boss/contract/template");
  };

  const redirectContractRegisterPage = () => {
    navigate("/boss/contract/register");
  };

  return (
    <div className="flex flex-col min-h-screen px-4 py-3">
      {/* 템플릿 설정 버튼 */}
      <Button
        size="sm"
        theme="outline"
        onClick={redirectContractTemplateListPage}
        className="w-full mb-2"
      >
        템플릿 설정
      </Button>

      {/* 리스트 영역 */}
      <div className="flex-1 mb-24">
        {loading ? (
          <div className="text-center text-grayscale-500 p-4 body-3">
            계약서 목록을 불러오는 중입니다...
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center text-grayscale-500 p-4 body-3">
            등록된 계약서가 없습니다.
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            {contracts.map((summary) => (
              <ContractContainer
                key={summary.staffSimpleResponse.staffId}
                summary={summary}
                onDeleteContract={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* 고정 버튼 */}
      <div className="sticky bottom-3 py-2">
        <Button
          size="sm"
          theme="secondary"
          onClick={redirectContractRegisterPage}
          className="w-full"
        >
          근로 계약서 작성
        </Button>
      </div>
    </div>
  );
};

export default BossContractListPage;
