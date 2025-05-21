import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayout } from "../../../hooks/useLayout.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import {
  getStoreInfo,
  reissueInviteCode,
  updateStoreInfo,
} from "../../../api/boss/store.ts";
import { storeSchema, StoreFormValues } from "../../../schemas/storeSchema.ts";
import TextField from "../../../components/common/TextField.tsx";
import Button from "../../../components/common/Button.tsx";
import SelectField from "../../../components/common/SelectField.tsx";
import { useNavigate } from "react-router-dom";
import { getCoordsFromAddress } from "../../../utils/kakaoGeocoder.ts";
import ResetIcon from "../../../components/icons/ResetIcon.tsx";
import GpsMapPreview from "../../../components/common/GpsMapPreview.tsx";

const StoreInfoEditPage = () => {
  useLayout({
    title: "매장 수정하기",
    theme: "plain",
    bottomNavVisible: false,
  });

  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const {
    control,
    setValue,
    watch,
    setError,
    handleSubmit,
    formState: { isValid },
  } = useForm<StoreFormValues>({
    mode: "onChange",
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "",
      businessNumber: "",
      storeType: "CAFE",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (!selectedStore) return;

    const fetchData = async () => {
      const data = await getStoreInfo(selectedStore.storeId);
      setValue("storeName", data.storeName);
      setValue("businessNumber", data.businessNumber);
      setValue("storeType", data.storeType);
      setValue("address", data.address);

      // 주소 기반 좌표 설정
      try {
        const coords = await getCoordsFromAddress(data.address);
        setValue("latitude", coords.latitude);
        setValue("longitude", coords.longitude);
      } catch (err) {
        console.error("좌표 변환 실패", err);
      }
    };
    fetchData();
  }, [selectedStore, setValue]);

  useEffect(() => {
    if (selectedStore) {
      setInviteCode(selectedStore.inviteCode);
    }
  }, [selectedStore]);

  const onSubmit = async (formData: StoreFormValues) => {
    if (!selectedStore) return;

    try {
      const { address, storeType, latitude, longitude } = formData;
      await updateStoreInfo(selectedStore.storeId, {
        address,
        storeType,
        gps: { latitude, longitude },
      });

      alert("매장 정보가 수정되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReissueCode = async () => {
    if (!selectedStore) return;

    try {
      setIsSpinning(true);
      const result = await reissueInviteCode(selectedStore.storeId);
      setInviteCode(result.inviteCode); // 새 코드 반영
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsSpinning(false), 1000); // 1초 후 애니메이션 해제
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

  if (!selectedStore) {
    alert("선택된 매장이 없습니다.");
    navigate("/store");
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6">
      {/* 매장명 (readOnly) */}
      <Controller
        name="storeName"
        control={control}
        render={({ field }) => (
          <TextField
            title="매장명"
            {...field}
            readOnly
            inputClassName="bg-grayscale-100"
            state="disable"
          />
        )}
      />

      {/* 사업자등록번호 (readOnly) */}
      <Controller
        name="businessNumber"
        control={control}
        render={({ field }) => (
          <TextField
            title="사업자등록번호"
            {...field}
            readOnly
            inputClassName="bg-grayscale-100"
            state="disable"
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

      {/* 주소 */}
      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            title="주소"
            {...field}
            required
            state={fieldState.error ? "warning" : "none"}
            helperText={fieldState.error?.message}
            inputClassName="bg-white"
            button={
              <Button
                size="md"
                theme="primary"
                type="button"
                onClick={() =>
                  window.open(
                    "/address-search",
                    "주소검색",
                    "width=600,height=600,scrollbars=yes",
                  )
                }
              >
                검색
              </Button>
            }
          />
        )}
      />
      <GpsMapPreview
        latitude={watch("latitude") as number}
        longitude={watch("longitude") as number}
      />

      {/* 초대코드 */}
      <div className="flex-col justify-start items-start gap-2 inline-flex w-full">
        <label className="title-1 text-grayscale-900">매장 초대코드</label>
        <div className="flex w-full justify-between rounded-lg border border-grayscale-300 px-5 py-3 body-1 transition-colors">
          <span>{inviteCode}</span>
          <ResetIcon
            onClick={handleReissueCode}
            className={`cursor-pointer ${isSpinning ? "animate-spin-one-time" : ""}`}
          />
        </div>
      </div>

      {/* 좌표는 숨겨진 컨트롤러 */}
      <Controller name="latitude" control={control} render={() => <></>} />
      <Controller name="longitude" control={control} render={() => <></>} />

      <button className="text-warning body-3 underline" onClick={() => {}}>
        매장 삭제하기
      </button>
      {/* 수정 버튼 */}
      <Button
        type="submit"
        size="md"
        theme="primary"
        state={isValid ? "default" : "disabled"}
        disabled={!isValid}
      >
        수정
      </Button>
    </form>
  );
};

export default StoreInfoEditPage;
