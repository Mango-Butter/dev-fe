import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { WithholdingType } from "../../../../types/payroll.ts";
import { updateStaffWithholding } from "../../../../api/boss/payroll.ts";
import SelectField from "../../../../components/common/SelectField.tsx";
import { cn } from "../../../../libs";

const withholdingSchema = z.object({
  withholdingType: z.enum(["NONE", "INCOME_TAX", "SOCIAL_INSURANCE"]),
});

interface StaffWithholdingCardProps {
  storeId: number;
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  initialType: WithholdingType;
}

const withholdingOptions = [
  { value: "NONE", label: "보험 적용 안함" },
  { value: "INCOME_TAX", label: "원천징수" },
  { value: "SOCIAL_INSURANCE", label: "4대보험" },
];

const StaffWithholdingCard = ({
  storeId,
  staff,
  initialType,
}: StaffWithholdingCardProps) => {
  const [value, setValue] = useState<WithholdingType>(initialType);
  const [isDirty, setIsDirty] = useState(false);

  const form = useMemo(() => ({ withholdingType: value }), [value]);

  const handleChange = (newVal: string) => {
    const next = newVal as WithholdingType;
    setValue(next);
    setIsDirty(next !== initialType);
  };

  const handleSave = async () => {
    const parsed = withholdingSchema.safeParse(form);
    if (!parsed.success) {
      toast.error("유효하지 않은 공제항목입니다.");
      return;
    }

    try {
      await updateStaffWithholding(storeId, staff.staffId, parsed.data);
      toast.success("공제 항목이 저장되었습니다.");
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
        <SelectField
          options={withholdingOptions}
          value={value}
          onChange={handleChange}
          size="sm"
        />
      </div>
    </div>
  );
};

export default StaffWithholdingCard;
