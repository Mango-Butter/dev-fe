import { useState } from "react";
import ArrowIcon from "../../../components/icons/ArrowIcon.tsx";
import ContractCard from "./ContractCard.tsx";
import { BossContractSummary } from "../../../types/contract";
import { cn } from "../../../libs";

interface Props {
  summary: BossContractSummary;
  onDeleteContract: (contractId: number, staffId: number) => void;
}

const ContractContainer = ({ summary, onDeleteContract }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { name, profileImageUrl } = summary.staffSimpleResponse;
  const contracts = summary.contractSimpleResponses;

  const contractCount = contracts.length;
  const latestStatus = contracts[contracts.length - 1]?.status;

  return (
    <div className="rounded-xl border border-grayscale-200 bg-white mb-3">
      {/* 컨테이너 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <img
            src={profileImageUrl}
            alt={`${name} 프로필`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="title-2">{name}</span>
            <span className="body-4 text-grayscale-500">
              근로계약서 {contractCount}건
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm px-2 py-0.5 rounded-full border",
              latestStatus === "COMPLETED"
                ? "text-green-600 border-green-200 bg-green-50"
                : latestStatus === "PENDING_STAFF_SIGNATURE"
                  ? "text-yellow-600 border-yellow-200 bg-yellow-50"
                  : "text-grayscale-400 border-grayscale-200 bg-grayscale-100",
            )}
          >
            {latestStatus === "COMPLETED"
              ? "완료"
              : latestStatus === "PENDING_STAFF_SIGNATURE"
                ? "서명 대기"
                : "미작성"}
          </span>

          <ArrowIcon direction={expanded ? "up" : "down"} />
        </div>
      </div>

      {/* 아코디언 내용 */}
      {expanded && (
        <div className="px-4 pb-3 flex flex-col gap-2">
          {contracts.map((contract) => (
            <ContractCard
              key={contract.contractId}
              contract={{ ...contract, staff: summary.staffSimpleResponse }}
              onDelete={() =>
                onDeleteContract(
                  contract.contractId,
                  summary.staffSimpleResponse.staffId,
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractContainer;
