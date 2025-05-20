import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import Button from "../../../components/common/Button.tsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import { useAuth } from "../../../hooks/useAuth.ts";
import { useUserStore } from "../../../stores/userStore.ts";
import { joinStoreAsStaff } from "../../../api/staff/store.ts";

const inviteCodeSchema = z.object({
  inviteCode: z
    .string()
    .length(6, "초대코드를 정확히 입력해주세요.")
    .regex(/^[A-Z0-9]{6}$/, "영문 대문자와 숫자만 입력해주세요."),
});
type InviteCodeForm = z.infer<typeof inviteCodeSchema>;

const StoreRegisterStaffPage = () => {
  useLayout({
    title: "매장 등록 요청",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    rightIcon: null,
    onBack: () => history.back(),
  });

  const { isLoggedIn, isLoading } = useAuth();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<InviteCodeForm>({
    mode: "onChange",
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const handleCodeChange = (value: string, index: number) => {
    const upper = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 1);
    const currentValues = getValues("inviteCode").split("");
    currentValues[index] = upper;
    const nextValue = currentValues.join("");

    setValue("inviteCode", nextValue, { shouldValidate: true });

    if (upper && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: InviteCodeForm) => {
    try {
      await joinStoreAsStaff(data.inviteCode);
      navigate("/staff");
    } catch (error: any) {
      const code = error?.response?.data?.errorCode;
      if (code === "ALREADY_JOIN_STAFF") {
        alert("이미 매장에 가입된 상태입니다.");
      } else if (code === "INVITE_CODE_NOT_FOUND") {
        alert("초대코드가 올바르지 않습니다.");
      } else {
        alert("매장 등록 중 오류가 발생했습니다.");
      }
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!isLoggedIn || !user) return <Navigate to="/login" replace />;

  return (
    <div className="h-full flex flex-col justify-between p-6 max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 flex-1"
      >
        <div className="flex flex-col items-start gap-2">
          <div className="heading-2">매장 초대코드</div>
          <div className="body-2 text-grayscale-500">
            사장님께 제공받은 숫자 6자리를 입력해주세요.
          </div>
        </div>

        <Controller
          name="inviteCode"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  className={`w-12 h-12 text-center rounded-lg text-xl uppercase border-2 focus:outline-none focus:border-2 transition-colors duration-150 ${
                    field.value[i]
                      ? "border-primary-900 focus:border-primary-900"
                      : "border-gray-200 focus:border-primary-900"
                  }`}
                  value={field.value[i] || ""}
                  onChange={(e) => handleCodeChange(e.target.value, i)}
                  onKeyDown={(e) => handleBackspace(e, i)}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
          )}
        />

        {/* 여기에 여유 공간 추가할 수 있음 */}
        <div className="flex-1" />

        <Button
          size="md"
          theme="primary"
          type="submit"
          state={isValid ? "default" : "disabled"}
          disabled={!isValid}
          className="w-full text-black"
        >
          확인
        </Button>
      </form>
    </div>
  );
};

export default StoreRegisterStaffPage;
