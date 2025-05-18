import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStoreStore from "../../../stores/storeStore";
import { cn } from "../../../libs";
import { dummyContracts } from "./dummyContracts.ts";

export interface BossContractSummary {
  staffName: string;
  templateName?: string;
  contractId?: number;
  status: "SIGNED" | "PENDING" | "NOT_CREATED";
}

const statusStyleMap: Record<BossContractSummary["status"], string> = {
  SIGNED: "text-green-500 border border-green-200 bg-green-50",
  PENDING: "text-yellow-600 border border-yellow-200 bg-yellow-50",
  NOT_CREATED:
    "text-grayscale-400 border border-grayscale-200 bg-grayscale-100",
};

const statusLabelMap: Record<BossContractSummary["status"], string> = {
  SIGNED: "서명 완료",
  PENDING: "서명 대기",
  NOT_CREATED: "미작성",
};

const BossContractListPage = () => {
  const { selectedStore } = useStoreStore();
  const [contracts, setContracts] = useState<BossContractSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 더미 데이터 적용
    setTimeout(() => {
      setContracts(dummyContracts);
      setLoading(false);
    }, 400);
  }, []);

  if (loading) {
    return (
      <div className="text-center text-grayscale-500 p-4 body-3">
        계약서 목록을 불러오는 중입니다...
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center text-grayscale-500 p-4 body-3">
        등록된 계약서가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-3 gap-3">
      {contracts.map((contract, index) => (
        <div
          key={index}
          className={cn(
            "flex justify-between items-center rounded-xl bg-white px-4 py-3",
            contract.status === "NOT_CREATED"
              ? "cursor-default"
              : "cursor-pointer",
          )}
          onClick={() =>
            contract.contractId &&
            navigate(`/boss/contract/${contract.contractId}`)
          }
        >
          <div className="flex flex-col">
            <span className="title-2">{contract.staffName}</span>
            {contract.templateName && (
              <span className="body-3 text-grayscale-500">
                {contract.templateName}
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-sm px-3 py-1 rounded-full font-medium",
              statusStyleMap[contract.status],
            )}
          >
            {statusLabelMap[contract.status]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BossContractListPage;
