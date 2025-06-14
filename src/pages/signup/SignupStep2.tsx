import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../components/common/TextField.tsx";
import Checkbox from "../../components/common/Checkbox.tsx";
import Button from "../../components/common/Button.tsx";
import ArrowIcon from "../../components/icons/ArrowIcon.tsx";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { SignupFormValues, signupSchema } from "../../schemas/signupSchema.ts";
import { useGeolocationPermission } from "../../hooks/useGeolocationPermission.ts";
import { useCameraPermission } from "../../hooks/useCameraPermission.ts";
import { useLayout } from "../../hooks/useLayout.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { signup } from "../../api/common/auth.ts";
import { useAuthStore } from "../../stores/authStore.ts";
import FullScreenLoading from "../../components/common/FullScreenLoading.tsx";
import { toast } from "react-toastify";
import { useState } from "react";

interface SignupStep2Props {
  role: "BOSS" | "STAFF";
  onBack: () => void;
}

const SignupStep2 = ({ role, onBack }: SignupStep2Props) => {
  useLayout({
    title: `${role === "BOSS" ? "사장님" : "알바생"} 회원가입`,
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    rightIcon: null,
    onBack,
  });

  const { isLoggedIn, isLoading } = useAuth();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  if (isLoading) return <FullScreenLoading />;
  if (!isLoggedIn || !user) return <Navigate to="/login" replace />;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<SignupFormValues>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      email: user.email,
      birth: user.birth,
      role,
      isAgreeTerms: false,
      isAgreePrivacy: false,
      isAgreeLocation: false,
      isAgreeCamera: false,
    },
  });

  // 약관 전체동의 처리
  const values = watch();
  const isAllChecked =
    values.isAgreeTerms &&
    values.isAgreePrivacy &&
    values.isAgreeLocation &&
    values.isAgreeCamera;
  const handleAgreeAll = (checked: boolean) => {
    setValue("isAgreeTerms", checked, { shouldValidate: true });
    setValue("isAgreePrivacy", checked, { shouldValidate: true });

    if (checked) {
      setIsRequestingLocation(true);
      setIsRequestingCamera(true);
      requestLocation();
      requestCamera();
    } else {
      setValue("isAgreeLocation", false, { shouldValidate: true });
      setValue("isAgreeCamera", false, { shouldValidate: true });
    }
  };

  const { permissionState: locationPermission, requestLocation } =
    useGeolocationPermission({
      onSuccess: () => {
        setIsRequestingLocation(false);
        setValue("isAgreeLocation", true, { shouldValidate: true });
      },
      onError: () => {
        setIsRequestingLocation(false);
        setValue("isAgreeLocation", false, { shouldValidate: true });
      },
    });

  const { permissionState: cameraPermission, requestCamera } =
    useCameraPermission({
      onSuccess: () => {
        setIsRequestingCamera(false);
        setValue("isAgreeCamera", true, { shouldValidate: true });
      },
      onError: () => {
        setIsRequestingCamera(false);
        setValue("isAgreeCamera", false, { shouldValidate: true });
      },
    });

  const onSubmit = async (data: SignupFormValues) => {
    if (!data.role) return;

    try {
      const { accessToken, refreshToken } = await signup(data.role);
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      toast.success("가입이 완료되었습니다!");
      navigate("/login", { replace: true });
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("이미 가입된 사용자입니다.");
      } else {
        toast.error("회원가입 실패", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-6 max-w-xl mx-auto"
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            title="이름"
            {...field}
            state="disable"
            readOnly
            inputClassName="bg-grayscale-100"
          />
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            title="전화번호"
            {...field}
            state="disable"
            readOnly
            inputClassName="bg-grayscale-100"
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            title="이메일"
            {...field}
            state="disable"
            readOnly
            inputClassName="bg-grayscale-100"
          />
        )}
      />

      <Controller
        name="birth"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            title="생년월일"
            state="disable"
            readOnly
            inputClassName="bg-grayscale-100"
          />
        )}
      />

      <div className="flex flex-col items-start self-stretch">
        <div className="flex items-center gap-1 mb-2">
          <label className="title-1 text-grayscale-900">약관 동의</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <div className="w-full rounded-2xl bg-grayscale-100 mb-2">
          <Checkbox
            checked={isAllChecked}
            onChange={(e) => handleAgreeAll(e.target.checked)}
            label="약관 전체 동의"
            className={
              isAllChecked
                ? "[&_span]:text-grayscale-900"
                : "[&_span]:text-grayscale-700"
            }
          />
        </div>

        <Controller
          name="isAgreeTerms"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              label="서비스 이용약관 동의"
              required
              icon={
                <Link
                  to="https://docs.google.com/document/d/1sFIlp430W6V1SOnA6BL4OBlDG8LnfY7m5spCOdyNmMk/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="my-auto"
                >
                  <ArrowIcon direction="right" />
                </Link>
              }
            />
          )}
        />

        <Controller
          name="isAgreePrivacy"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              label="개인정보 처리방침 동의"
              required
              icon={
                <Link
                  to="https://docs.google.com/document/d/1JLk4JOV_wgg7WVzACsP9jcblS-jMPQl4B_QcNbVyQAw/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="my-auto"
                >
                  <ArrowIcon direction="right" />
                </Link>
              }
            />
          )}
        />

        <Controller
          name="isAgreeLocation"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={() => {
                if (field.value) {
                  setValue("isAgreeLocation", false, { shouldValidate: true });
                } else {
                  setIsRequestingLocation(true);
                  requestLocation();
                }
              }}
              label="위치 정보 수집 동의"
              description={
                locationPermission === "denied"
                  ? "위치 권한이 차단되어 있습니다. 브라우저 설정에서 수동 허용이 필요합니다"
                  : "동의 시 위치 권한이 요청되며, 출퇴근 기능 등에 활용됩니다."
              }
              required
              isLoading={isRequestingLocation}
            />
          )}
        />

        <Controller
          name="isAgreeCamera"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={() => {
                if (field.value) {
                  setValue("isAgreeCamera", false, { shouldValidate: true });
                } else {
                  setIsRequestingCamera(true);
                  requestCamera();
                }
              }}
              label="카메라 사용 권한 동의"
              description={
                cameraPermission === "denied"
                  ? "카메라 권한이 차단되어 있습니다. 브라우저 설정에서 수동 허용이 필요합니다"
                  : "동의 시 카메라 사용권한이 요청되며, 출퇴근 기능 등에 활용됩니다."
              }
              required
              isLoading={isRequestingCamera}
            />
          )}
        />
      </div>

      <Button
        size="md"
        theme="primary"
        type="submit"
        state={isValid ? "default" : "disabled"}
        disabled={!isValid}
        className="w-full text-black"
      >
        {role === "BOSS" ? "사장님" : "알바생"}으로 가입하기
      </Button>
    </form>
  );
};

export default SignupStep2;
