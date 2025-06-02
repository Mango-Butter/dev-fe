import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayout } from "../../../hooks/useLayout.ts";
import { useUserStore } from "../../../stores/userStore.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TextField from "../../../components/common/TextField.tsx";
import SelectField from "../../../components/common/SelectField.tsx";
import Checkbox from "../../../components/common/Checkbox.tsx";
import Button from "../../../components/common/Button.tsx";
import {
  accountRegisterSchema,
  AccountRegisterForm,
} from "../../../schemas/accountRegisterSchema";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { verifyStaffAccount } from "../../../api/staff/payroll.ts";

const bankNameOptions = [{ label: "농협은행", value: "농협은행" }];

const StaffAccountRegisterPage = () => {
  const { selectedStore } = useStaffStoreStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<AccountRegisterForm>({
    resolver: zodResolver(accountRegisterSchema),
    mode: "onChange",
    defaultValues: {
      bankName: "농협은행",
      accountNumber: "",
      birthdate: user?.birth?.replace(/-/g, "") ?? "",
      password: "",
      agreeWithdraw: false,
    },
  });

  useLayout({
    title: "계좌 등록하기",
    theme: "plain",
    bottomNavVisible: false,
  });

  const onSubmit = async (data: AccountRegisterForm) => {
    if (!selectedStore) return;

    try {
      await verifyStaffAccount(selectedStore.storeId, data);
      toast.success("계좌가 등록되었습니다.");
      navigate("/staff/mypage", { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form
      className="p-6 flex flex-col h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col h-[90vh] overflow-y-auto gap-4">
        <TextField
          title="예금주 명"
          required
          value={user?.name ?? ""}
          readOnly
        />

        <Controller
          control={control}
          name="birthdate"
          render={({ field }) => (
            <TextField
              title="생년월일"
              required
              placeholder="예: 20000309"
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="bankName"
          render={({ field }) => (
            <SelectField
              title="은행"
              required
              options={bankNameOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="accountNumber"
          render={({ field }) => (
            <TextField
              title="계좌번호"
              required
              placeholder="'-' 없이 입력해주세요"
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              title="계좌 비밀번호"
              required
              type="password"
              placeholder="4자리 숫자"
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="agreeWithdraw"
          render={({ field }) => (
            <Checkbox
              label="출금 동의"
              description="등록한 계좌를 통해 급여지급일에 자동 출금됩니다."
              checked={field.value}
              onChange={field.onChange}
              required
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

export default StaffAccountRegisterPage;
