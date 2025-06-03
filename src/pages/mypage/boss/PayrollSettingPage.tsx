import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  payrollSettingsSchema,
  PayrollSettingsForm,
} from "../../../schemas/payrollSettingsSchema";
import useStoreStore from "../../../stores/storeStore.ts";
import {
  deleteAccountInfo,
  fetchPayrollSettings,
  updatePayrollSettings,
} from "../../../api/boss/payroll.ts";
import SelectField from "../../../components/common/SelectField.tsx";
import Button from "../../../components/common/Button.tsx";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import DeleteIcon from "../../../components/icons/DeleteIcon.tsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import { toast } from "react-toastify";
import { BossPayrollSettingsResponse } from "../../../types/payroll.ts";
import NHBankIcon from "../../../assets/NHBankIcon.png";
import { useNavigate } from "react-router-dom";
import { showConfirm } from "../../../libs/showConfirm.ts";
import { useTooltip } from "../../../hooks/useTooltip.tsx";

const deductionOptions = [
  { label: "0분 단위", value: "ZERO_MIN" },
  { label: "5분 단위", value: "FIVE_MIN" },
  { label: "10분 단위", value: "TEN_MIN" },
  { label: "30분 단위", value: "THIRTY_MIN" },
];

const transferOptions = [
  { label: "자동송금 사용", value: "true" },
  { label: "수동 송금", value: "false" },
];

const extraWorkOptions = [
  { label: "0분", value: "0" },
  { label: "30분", value: "30" },
  { label: "60분", value: "60" },
  { label: "90분", value: "90" },
];

const PayrollSettingPage = () => {
  const { selectedStore } = useStoreStore();
  const [account, setAccount] =
    useState<BossPayrollSettingsResponse["account"]>(null);
  const navigate = useNavigate();
  const { tooltipRef, toggleTooltip, TooltipBox } = useTooltip({
    duration: 3000,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<PayrollSettingsForm>({
    resolver: zodResolver(payrollSettingsSchema),
    mode: "onChange",
    defaultValues: {
      autoTransferEnabled: true,
      transferDate: null,
      deductionUnit: "ZERO_MIN",
      commutingAllowance: 0,
    },
  });

  useLayout({
    title: "급여 설정",
    theme: "plain",
    bottomNavVisible: false,
  });

  useEffect(() => {
    loadAndApplySettings();
  }, [selectedStore]);

  const loadAndApplySettings = async () => {
    if (!selectedStore) return;
    const data = await fetchPayrollSettings(selectedStore.storeId);
    setAccount(data.account);
    reset(data);
  };

  const onSubmit = async (data: PayrollSettingsForm) => {
    if (!selectedStore) return;
    try {
      await updatePayrollSettings(selectedStore.storeId, data);
      toast.success("급여 설정이 저장되었습니다.");
      await loadAndApplySettings();
    } catch (e) {
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (!selectedStore) return;

    const confirmed = await showConfirm({
      title: "계좌를 삭제하시겠습니까?",
      text: "계좌 정보는 삭제 후 재등록할 수 있습니다.",
      confirmText: "삭제",
      cancelText: "취소",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      await deleteAccountInfo(selectedStore.storeId);
      toast.success("계좌 정보가 삭제되었습니다.");
      await loadAndApplySettings();
    } catch (err) {
      toast.error("계좌 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const redirectRegisterAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/boss/store/account-register");
  };

  return (
    <form
      className="p-6 flex flex-col h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col h-[90vh] overflow-y-auto gap-4">
        <div className="w-full border-grayscale-300">
          <Controller
            control={control}
            name="autoTransferEnabled"
            render={({ field }) => (
              <SelectField
                title="자동 송금 여부"
                required
                options={transferOptions}
                value={String(field.value)}
                onChange={(val) => field.onChange(val === "true")}
              />
            )}
          />
        </div>

        {/* 계좌 영역 */}
        <section className="flex flex-col gap-3">
          <label className="title-1 text-grayscale-900">
            자동송금 계좌설정
          </label>

          {account ? (
            <div className="flex justify-between items-center w-full rounded-lg border border-grayscale-300 bg-grayscale-100 px-4 py-3">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <img
                    src={NHBankIcon}
                    alt="농협은행"
                    className="h-4 w-[13px]"
                  />
                  <span className="title-2 text-grayscale-800">
                    {account.bankName}
                  </span>
                </div>
                <p className="body-3 text-grayscale-500">
                  {account.accountNumber}
                </p>
              </div>
              <button onClick={handleDeleteAccount}>
                <DeleteIcon className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 border border-grayscale-300 rounded-xl p-4">
              <ErrorIcon className="w-9 h-9" />
              <p className="body-2 text-grayscale-700">
                등록된 계좌가 없습니다.
              </p>
              <button
                className="body-3 text-primary hover:underline"
                onClick={redirectRegisterAccount}
              >
                + 계좌 추가하기
              </button>
            </div>
          )}
        </section>

        <Controller
          control={control}
          name="transferDate"
          render={({ field }) => (
            <SelectField
              title="급여지급일"
              required
              icon={
                <div className="relative">
                  <div ref={tooltipRef}>
                    <span className="cursor-pointer" onClick={toggleTooltip}>
                      <ErrorIcon className="w-5 h-5 rotate-180" />
                    </span>
                  </div>
                  <TooltipBox>
                    이미 확정된 급여는 당시 지급일 기준으로
                    <br />
                    계산되어, 현재 설정 변경과는 무관합니다.
                    <br />
                    지급일 변경은 다음 미확정 급여부터 적용됩니다.
                  </TooltipBox>
                </div>
              }
              options={Array.from({ length: 28 }, (_, i) => ({
                label: `${i + 1}일`,
                value: String(i + 1),
              }))}
              value={String(field.value ?? "")}
              onChange={(val) => field.onChange(Number(val))}
            />
          )}
        />

        <Controller
          control={control}
          name="deductionUnit"
          render={({ field }) => (
            <SelectField
              title="급여 차감 단위"
              required
              options={deductionOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="commutingAllowance"
          render={({ field }) => (
            <SelectField
              title="추가근무 허용시간"
              required
              options={extraWorkOptions}
              value={String(field.value)}
              onChange={(val) => field.onChange(Number(val))}
            />
          )}
        />
      </div>
      <Button
        size="md"
        theme="primary"
        state={!isDirty || !isValid ? "disabled" : "default"}
        type="submit"
        disabled={!isDirty || !isValid}
        className="w-full my-3 text-black"
      >
        저장
      </Button>
    </form>
  );
};

export default PayrollSettingPage;
