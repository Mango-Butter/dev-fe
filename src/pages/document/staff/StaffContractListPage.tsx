import { useEffect, useState } from "react";
import { StaffContractSummary } from "../../../types/contract";
import useStaffStoreStore from "../../../stores/useStaffStoreStore";
import Button from "../../../components/common/Button";
import { format } from "date-fns";
import { fetchStaffContracts } from "../../../api/staff/constract.ts";
import { useNavigate } from "react-router-dom";

const StaffContractListPage = () => {
  const { selectedStore } = useStaffStoreStore();
  const [contracts, setContracts] = useState<StaffContractSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedStore) return;

    const fetch = async () => {
      try {
        const data = await fetchStaffContracts(selectedStore.storeId);
        setContracts(data);
      } catch (e) {
        console.error("근로계약서 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedStore]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-grayscale-500 body-3">
        계약서 목록을 불러오는 중입니다...
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-grayscale-500 body-3">
        아직 작성된 근로계약서가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-3 gap-3">
      {contracts.map((contract) => (
        <div
          key={contract.contractId}
          onClick={() => navigate(`/staff/contract/${contract.contractId}`)} // ✅ 카드 클릭 시 이동
          className="cursor-pointer flex flex-col gap-2 p-4 border border-grayscale-300 bg-white shadow-basic rounded-xl hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="title-2">근로계약서 #{contract.contractId}</span>
              <span className="body-3 text-grayscale-500">
                {format(new Date(contract.modifiedAt), "yyyy.MM.dd")}
              </span>
            </div>

            {contract.isSigned ? (
              <Button size="sm" theme="ghost2" state="default">
                보기
              </Button>
            ) : (
              <Button size="sm" theme="ghost2" state="default">
                서명하기
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffContractListPage;
