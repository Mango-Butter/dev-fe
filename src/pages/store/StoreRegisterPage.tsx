import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSchema, StoreFormValues } from "../../schemas/storeSchema.ts";
import TextField from "../../components/common/TextField.tsx";
import Button from "../../components/common/Button.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import { useLayout } from "../../hooks/useLayout.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { getCoordsFromAddress } from "../../utils/kakaoGeocoder";
import { useEffect, useState } from "react";
import SelectField from "../../components/common/SelectField.tsx";
import { registerStore, validateBusinessNumber } from "../../api/store.ts";
import Spinner from "../../components/common/Spinner.tsx";
import modalStore from "../../stores/modalStore.ts";

const StoreRegisterPage = () => {
  useLayout({
    title: "매장 추가하기",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    rightIcon: null,
    onBack: () => history.back(),
  });

  const { isLoggedIn, isLoading } = useAuth();
  const { user } = useUserStore();
  const [isBusinessNumberChecked, setIsBusinessNumberChecked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { setModalOpen } = modalStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
    setError,
    clearErrors,
  } = useForm<StoreFormValues>({
    mode: "onChange",
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "",
      businessNumber: "",
      address: "",
      storeType: "CAFE",
      latitude: undefined,
      longitude: undefined,
    },
  });

  const checkBusinessNumber = async () => {
    if (isChecking) return; // 중복 호출 방지

    const businessNumber = getValues("businessNumber");
    setIsChecking(true);
    try {
      await validateBusinessNumber(businessNumber);
      clearErrors("businessNumber");
      setIsBusinessNumberChecked(true);
      setValue("businessNumber", businessNumber, {
        shouldValidate: true,
        shouldDirty: false,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ??
        "사업자등록번호 확인 중 오류가 발생했습니다.";
      setError("businessNumber", { type: "manual", message });
      setIsBusinessNumberChecked(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.origin) return;

      const selectedAddress = event.data?.address;
      if (selectedAddress) {
        setValue("address", selectedAddress, { shouldValidate: true });

        try {
          const { latitude, longitude } =
            await getCoordsFromAddress(selectedAddress);
          setValue("latitude", latitude);
          setValue("longitude", longitude);
        } catch (e) {
          setError("address", { message: "주소 → 좌표 변환 실패" });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onSubmit = async (data: StoreFormValues) => {
    try {
      const {
        storeName,
        businessNumber,
        address,
        storeType,
        latitude,
        longitude,
      } = data;
      const payload = {
        storeName,
        businessNumber,
        address,
        storeType,
        gps: { latitude, longitude },
      };
      await registerStore(payload);
      setModalOpen(true);
      navigate(-1);
    } catch (err) {
      alert("등록 실패");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!isLoggedIn || !user) return <Navigate to="/login" replace />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-6 max-w-xl mx-auto"
    >
      {/* 매장명 */}
      <Controller
        name="storeName"
        control={control}
        render={({ field }) => (
          <TextField
            title="매장명"
            placeholder="망고카페"
            {...field}
            required
          />
        )}
      />

      {/* 사업자등록번호 */}
      <Controller
        name="businessNumber"
        control={control}
        render={({ field, fieldState }) => {
          const showVerified = isBusinessNumberChecked && !fieldState.error;
          const helperText = showVerified
            ? "사용 가능한 사업자번호입니다"
            : fieldState.error?.message ||
              (field.value ? "다시 인증해주세요" : undefined);

          return (
            <TextField
              title="사업자등록번호"
              {...field}
              required
              placeholder="1234567890"
              helperText={helperText}
              state={
                fieldState.error ? "warning" : showVerified ? "correct" : "none"
              }
              button={
                <Button
                  size="md"
                  state={fieldState.error ? "disabled" : "default"}
                  theme="primary"
                  type="button"
                  onClick={checkBusinessNumber}
                  disabled={!!fieldState.error || isChecking}
                >
                  {isChecking ? <Spinner /> : "확인"}
                </Button>
              }
              onChange={(e) => {
                field.onChange(e);
                if (isBusinessNumberChecked) {
                  setIsBusinessNumberChecked(false);
                }
              }}
            />
          );
        }}
      />

      {/* 주소 */}
      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            title="주소"
            {...field}
            readOnly
            inputClassName="bg-grayscale-100"
            required
            state={fieldState.error ? "warning" : "none"}
            helperText={fieldState.error?.message}
            button={
              <Button
                size="md"
                theme="primary"
                type="button"
                onClick={() => {
                  window.open(
                    "/address-search",
                    "주소검색",
                    "width=600,height=600,scrollbars=yes",
                  );
                }}
              >
                검색
              </Button>
            }
          />
        )}
      />

      {/* 업종 */}
      <Controller
        name="storeType"
        control={control}
        render={({ field }) => (
          <SelectField
            title="업종"
            value={field.value}
            onChange={field.onChange}
            options={[
              { label: "카페", value: "CAFE" },
              { label: "음식점", value: "RESTAURANT" },
              { label: "편의점", value: "CONVENIENCE_STORE" },
            ]}
            required
          />
        )}
      />

      {/*위도/경도*/}
      <Controller name="latitude" control={control} render={() => <></>} />
      <Controller name="longitude" control={control} render={() => <></>} />

      <Button
        size="md"
        theme="primary"
        type="submit"
        state={isValid ? "default" : "disabled"}
        disabled={!isValid}
        className="w-full text-black"
      >
        매장 등록하기
      </Button>
    </form>
  );
};

export default StoreRegisterPage;
