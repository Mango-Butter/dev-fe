// src/components/payroll/BossAutoTransferCheckCard.tsx
import { EstimatedPayrollItem } from "../../../../types/payroll";
import {
  CheckboxFilled,
  CheckboxOff,
} from "../../../../components/icons/CheckboxIcon.tsx";
import { toast } from "react-toastify";

interface Props {
  item: EstimatedPayrollItem;
  checked: boolean;
  onToggle: (key: string) => void;
}

const BossAutoTransferCheckCard = ({ item, checked, onToggle }: Props) => {
  const { staff, payroll } = item;
  const isSelectable = payroll.key !== null;

  const handleClick = () => {
    if (!isSelectable) {
      toast.warn("해당 알바생은 계좌 정보가 없어 확정할 수 없습니다.");
      return;
    }
    onToggle(payroll.key!);
  };

  return (
    <div className="flex flex-col gap-2 items-start p-4 border border-grayscale-200 rounded-xl bg-white shadow-sm">
      <div className="flex items-start justify-between w-full">
        {/* 왼쪽 */}
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-grayscale-200 overflow-hidden">
            {staff.profileImageUrl && (
              <img
                src={staff.profileImageUrl}
                alt={staff.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-semibold mb-1">{staff.name}</p>
            <p className="text-xs text-grayscale-500 mb-2">
              {payroll.data.bankCode ?? "계좌 미등록"}{" "}
              {payroll.data.account ?? ""}
            </p>
          </div>
        </div>

        {/* 체크박스 */}
        <button
          type="button"
          className="mt-1"
          onClick={handleClick}
          disabled={!isSelectable}
        >
          {checked ? <CheckboxFilled /> : <CheckboxOff />}
        </button>
      </div>

      <div className="text-xs text-grayscale-700 space-y-1">
        <div className="flex items-center gap-2">
          <span className="body-3 w-14">총 근무시간</span>
          <span className="body-3">{payroll.data.totalTime}시간</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="body-3 w-14">실 지급액</span>
          <span className="body-3 text-black">
            {payroll.data.netAmount.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default BossAutoTransferCheckCard;
