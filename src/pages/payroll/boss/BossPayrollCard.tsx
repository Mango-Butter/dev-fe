// src/components/payroll/BossPayrollCard.tsx
import {
  CheckboxFilled,
  CheckboxOff,
} from "../../../components/icons/CheckboxIcon.tsx";
import { StaffPayroll } from "../../../types/payroll.ts";

interface Props {
  data: StaffPayroll;
  checked: boolean;
  editable: boolean;
  onToggle: (key: string) => void;
}

const BossPayrollCard = ({ data, checked, editable, onToggle }: Props) => {
  const { staff, payroll } = data;

  return (
    <div className="flex flex-col gap-2 items-start p-4 border border-grayscale-200 rounded-xl bg-white shadow-sm">
      <div className="flex items-start justify-between w-full">
        {/* 왼쪽: 프로필 + 급여 정보 */}
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
              {payroll.bankCode} {payroll.account}
            </p>
          </div>
        </div>

        {/* 오른쪽: 체크박스 */}
        <button
          type="button"
          className="mt-1"
          onClick={() => editable && onToggle(payroll.key)}
          disabled={!editable}
        >
          {editable ? (
            checked ? (
              <CheckboxFilled />
            ) : (
              <CheckboxOff />
            )
          ) : checked ? (
            <CheckboxFilled fill="#6B6B6B" />
          ) : (
            <CheckboxOff />
          )}
        </button>
      </div>

      <div className="text-xs text-grayscale-700 space-y-1">
        <div className="flex items-center gap-2">
          <span className="body-3 w-14">총 근무시간</span>
          <span className="body-3">{payroll.totalTime}시간</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="body-3 w-14">실 지급액</span>
          <span className="body-3 text-black">
            {payroll.netAmount.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default BossPayrollCard;
