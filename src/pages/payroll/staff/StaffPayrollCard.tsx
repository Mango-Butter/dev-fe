// src/components/payroll/StaffPayrollCard.tsx
import { StaffPayrollResponse } from "../../../types/payroll";

interface Props {
  data: StaffPayrollResponse;
}

const StaffPayrollCard = ({ data }: Props) => {
  const {
    totalTime,
    totalAmount,
    baseAmount,
    weeklyAllowance,
    totalCommutingAllowance,
    withholdingTax,
    netAmount,
    withholdingType,
  } = data.data;

  const baseRate = (baseAmount / totalAmount) * 100;
  const weeklyRate = (weeklyAllowance / totalAmount) * 100;
  const commuteRate = (totalCommutingAllowance / totalAmount) * 100;
  const taxRate = (withholdingTax / totalAmount) * 100;

  return (
    <div className="w-full bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      {/* 상단 정보 */}
      <div className="flex flex-col w-full items-start">
        <div className="w-full body-3 text-grayscale-500 text-start">
          {{
            INCOME_TAX: "원천징수 3.3%",
            SOCIAL_INSURANCE: "4대보험 9.4%",
            NONE: "보험적용안함",
          }[withholdingType] ?? ""}
        </div>
        <div className="flex flex-col w-full gap-1">
          <div className="w-full flex gap-2 items-center justify-end">
            <p className="body-3 text-gray-500">총 근무시간</p>
            <p className="title-1">{totalTime}시간</p>
          </div>
          <div className="w-full flex gap-2 items-center justify-end">
            <p className="body-3 text-gray-500 mt-2">지급 총액</p>
            <p className="title-1">{totalAmount.toLocaleString()}원</p>
          </div>
          <div className="w-full flex gap-2 items-center justify-end">
            <p className="body-3 text-gray-500 mt-2">공제 세금</p>
            <p className="title-1">-{withholdingTax.toLocaleString()}원</p>
          </div>
          <div className="w-full flex flex-col gap-2 justify-end items-end border-t border-gray-100 pt-1 mt-2">
            <p className="text-sm text-gray-500 mt-2">실수령액</p>
            <p className="font-semibold text-xl">
              {netAmount.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

      {/* 그래프 */}
      <div className="w-full h-4 rounded-md overflow-hidden flex">
        <div
          className="bg-green-400"
          style={{ width: `${baseRate}%` }}
          title="기본급"
        />
        <div
          className="bg-purple-400"
          style={{ width: `${weeklyRate}%` }}
          title="주휴수당"
        />
        <div
          className="bg-blue-400"
          style={{ width: `${commuteRate}%` }}
          title="교통비"
        />
        <div
          className="bg-red-500"
          style={{ width: `${taxRate}%` }}
          title="공제 세금"
        />
      </div>

      {/* 범례 */}
      <div className="flex w-full justify-end flex-wrap gap-x-4 gap-y-1 text-xs mt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <span>기본급</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-400 rounded-sm" />
          <span>주휴수당</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 rounded-sm" />
          <span>교통비</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
          <span>세금</span>
        </div>
      </div>
    </div>
  );
};

export default StaffPayrollCard;
