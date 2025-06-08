import { useState } from "react";
import { toast } from "react-toastify";
import TextField from "../../../../components/common/TextField";
import { cn } from "../../../../libs";
import { updateStaffHourlyWage } from "../../../../api/boss/payroll.ts";
import { showConfirm } from "../../../../libs/showConfirm.ts";

// 나중에 실제 API 연결 시 사용
// import { updateStaffHourlyWage } from "../../../../api/boss/payroll";

interface StaffWageCardProps {
  storeId: number;
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  initialWage: number;
}

const StaffWageCard = ({ storeId, staff, initialWage }: StaffWageCardProps) => {
  const [wage, setWage] = useState(initialWage.toString());
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // 숫자만 허용
    if (!/^\d*$/.test(val)) return;
    setWage(val);
    setIsDirty(val !== initialWage.toString());
  };

  const handleSave = async () => {
    const wageNumber = parseInt(wage, 10);
    if (isNaN(wageNumber) || wageNumber < 0) {
      toast.error("유효한 시급을 입력해주세요.");
      return;
    }

    // 💡 10만원 이상이면 경고창 표시
    if (wageNumber >= 100000) {
      const confirm = await showConfirm({
        title: "시급 확인",
        text: `입력하신 시급은 ${wageNumber.toLocaleString()}원입니다.\n정말 저장하시겠습니까?`,
        confirmText: "예, 저장할게요",
        cancelText: "아니요",
        icon: "warning",
      });

      if (!confirm) return;
    }

    try {
      await updateStaffHourlyWage(storeId, staff.staffId, {
        hourlyWage: wageNumber,
      });
      toast.success("시급이 저장되었습니다.");
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      toast.error("저장에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-start justify-between gap-4">
      <div className="flex w-full justify-between items-start">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-4">
            <img
              src={staff.profileImageUrl}
              alt={staff.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="title-2">{staff.name}</span>
          </div>
          <button
            className="body-3 text-primary underline disabled:text-grayscale-400"
            disabled={!isDirty}
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 w-full",
          isDirty ? "text-black" : "text-grayscale-500",
        )}
      >
        <TextField
          value={wage}
          onChange={handleChange}
          placeholder="시급을 입력하세요"
          size="sm"
          theme="suffix"
          suffix="원"
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

export default StaffWageCard;
