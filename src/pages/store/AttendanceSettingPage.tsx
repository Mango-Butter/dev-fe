import { useLayout } from "../../hooks/useLayout.ts";
import { RadioOff, RadioSecondary } from "../../components/icons/RadioIcon.tsx";
import Button from "../../components/common/Button.tsx";
import ResetIcon from "../../components/icons/ResetIcon.tsx";
import TextField from "../../components/common/TextField.tsx";
import { useEffect, useState } from "react";
import useStoreStore from "../../stores/storeStore.ts";
import {
  AttendanceMethod,
  getAttendanceSettings,
  updateAttendanceSettings,
  getQrCodeSettings,
  reissueQrCode,
  getGpsSettings,
  updateGpsSettings,
} from "../../api/store.ts";
import { QRCodeCanvas } from "qrcode.react";
import { z } from "zod";
import { getCoordsFromAddress } from "../../utils/kakaoGeocoder.ts";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GpsMapPreview from "../../components/common/GpsMapPreview.tsx";

const gpsSchema = z.object({
  address: z.string().min(1, "주소를 입력해주세요."),
  gpsRangeMeters: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        const num = Number(val);
        return Number.isNaN(num) ? undefined : num;
      }
      return undefined;
    },
    z
      .number({
        required_error: "GPS 범위를 입력해주세요.",
        invalid_type_error: "숫자를 입력해주세요.",
      })
      .min(10)
      .max(999),
  ),
  gpsLatitude: z.number(),
  gpsLongitude: z.number(),
});

type GpsFormData = z.infer<typeof gpsSchema>;

const AttendanceSettingPage = () => {
  useLayout({
    title: "출퇴근 방식 설정",
    theme: "plain",
    bottomNavVisible: false,
  });

  const { selectedStore } = useStoreStore();
  const [attendanceMethod, setAttendanceMethod] =
    useState<AttendanceMethod | null>(null);
  const [isMethodUpdating, setIsMethodUpdating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isQRUpdating, setIsQRUpdating] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gpsSchema),
    defaultValues: {
      address: "",
      gpsRangeMeters: 100,
      gpsLatitude: 0,
      gpsLongitude: 0,
    },
  });

  const fetchSettings = async () => {
    if (!selectedStore) return;
    const method = await getAttendanceSettings(selectedStore.storeId);
    setAttendanceMethod(method.attendanceMethod);

    if (
      method.attendanceMethod === "QR" ||
      method.attendanceMethod === "BOTH"
    ) {
      const qr = await getQrCodeSettings(selectedStore.storeId);
      setQrCodeUrl(qr.qrCode);
    }

    if (
      method.attendanceMethod === "GPS" ||
      method.attendanceMethod === "BOTH"
    ) {
      const gps = await getGpsSettings(selectedStore.storeId);
      reset(gps);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [selectedStore]);

  const handleUpdate = async (method: AttendanceMethod) => {
    if (!selectedStore || isMethodUpdating) return;
    setIsMethodUpdating(true);
    try {
      await updateAttendanceSettings(selectedStore.storeId, {
        attendanceMethod: method,
      });
      setAttendanceMethod(method);

      if (method === "QR" || method === "BOTH") {
        const qr = await getQrCodeSettings(selectedStore.storeId);
        setQrCodeUrl(qr.qrCode);
      } else {
        setQrCodeUrl(null);
      }

      if (method === "GPS" || method === "BOTH") {
        const gps = await getGpsSettings(selectedStore.storeId);
        reset(gps);
      } else {
        reset({
          address: "",
          gpsRangeMeters: 100,
          gpsLatitude: 0,
          gpsLongitude: 0,
        });
      }
    } finally {
      setIsMethodUpdating(false);
    }
  };

  const handleReissueQr = async () => {
    if (!selectedStore) return;
    try {
      setIsQRUpdating(true);
      const qr = await reissueQrCode(selectedStore.storeId);
      setQrCodeUrl(qr.qrCode);
    } catch (err) {
      alert("QR 재발급 실패");
    } finally {
      setTimeout(() => setIsQRUpdating(false), 1000);
    }
  };

  const onSubmit = async (data: GpsFormData) => {
    if (!selectedStore) return;
    try {
      await updateGpsSettings(selectedStore.storeId, data);
      alert("GPS 설정이 저장되었습니다.");
    } catch (err) {
      alert("GPS 설정 저장 실패");
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
          setValue("gpsLatitude", latitude);
          setValue("gpsLongitude", longitude);
        } catch (e) {
          setError("address", { message: "주소 → 좌표 변환 실패" });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setValue, setError]);

  if (!selectedStore || attendanceMethod === null) {
    return <div className="text-center py-6">로딩 중...</div>;
  }

  const isSelected = (method: AttendanceMethod) => attendanceMethod === method;

  return (
    <div className="py-6 px-5">
      <div className="flex flex-col gap-4">
        {(
          [
            {
              type: "QR",
              label: "QR 코드 방식",
              description:
                "매장내 QR코드를 스캔하여 알바생이 출퇴근 할 수 있게 설정합니다.",
            },
            {
              type: "GPS",
              label: "GPS 방식",
              description:
                "알바생의 GPS 위치를 기반으로 하여 출퇴근 할 수 있게 설정합니다.",
            },
            {
              type: "BOTH",
              label: "QR & GPS 방식",
              description:
                "알바생이 매장 내 QR코드를 스캔할 때, 현재 위치를 함께 확인하여 출퇴근 할 수 있게 설정합니다.",
            },
          ] as const
        ).map(({ type, label, description }) => (
          <div
            key={type}
            className={`cursor-pointer flex py-3 px-4 border rounded-xl flex-col justify-center items-start gap-2 self-stretch transition-colors ${
              isSelected(type)
                ? "shadow-blue-shadow border-grayscale-300 bg-white"
                : "shadow-basic border-grayscale-300 bg-white"
            } ${isMethodUpdating ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => handleUpdate(type)}
          >
            <div className="w-full flex gap-3">
              {isSelected(type) ? <RadioSecondary /> : <RadioOff />}
              <span className="title-1">{label}</span>
            </div>
            <span className="body-2 text-gray-500">{description}</span>
          </div>
        ))}
      </div>

      {(attendanceMethod === "QR" || attendanceMethod === "BOTH") && (
        <div className="flex flex-col gap-5 mt-6 pt-4 border-t border-grayscale-200">
          <div className="flex w-full justify-between items-center">
            <span className="heading-2">QR 코드</span>
            <Button
              size="icon_sm"
              theme="outline"
              icon={
                <ResetIcon
                  className={`${isQRUpdating ? "animate-spin-one-time" : ""}`}
                />
              }
              onClick={handleReissueQr}
            />
          </div>
          <div className="w-full flex justify-center items-center p-4 shadow-basic rounded-xl border border-grayscale-200">
            {qrCodeUrl ? (
              <QRCodeCanvas value={qrCodeUrl} size={250} />
            ) : (
              <span>QR 코드를 불러오는 중입니다...</span>
            )}
          </div>
        </div>
      )}

      {(attendanceMethod === "GPS" || attendanceMethod === "BOTH") && (
        <form
          className="flex flex-col gap-5 mt-6 pt-4 border-t border-grayscale-200"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full justify-start items-center">
            <span className="heading-2">GPS 범위 설정</span>
          </div>

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                title="주소"
                readOnly
                inputClassName="bg-grayscale-100"
                required
                state={errors.address ? "warning" : "none"}
                helperText={errors.address?.message}
                {...field}
                button={
                  <Button
                    size="md"
                    theme="ghost2"
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

          <Controller
            name="gpsRangeMeters"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value as number}
                title="출퇴근 허용범위"
                description="매장의 GPS 가능 여부를 확인해주세요. 매장이 지하인 경우 GPS가 원활하지 않을 수 있습니다."
                theme="suffix"
                suffix="m"
                type="number"
                min="10"
                max="999"
                required
                state={errors.gpsRangeMeters ? "warning" : "none"}
                helperText={errors.gpsRangeMeters?.message}
              />
            )}
          />
          <GpsMapPreview
            latitude={watch("gpsLatitude") as number}
            longitude={watch("gpsLongitude") as number}
            radiusMeters={watch("gpsRangeMeters") as number}
          />

          <Button theme="secondary" type="submit">
            GPS 설정 저장
          </Button>
        </form>
      )}
    </div>
  );
};

export default AttendanceSettingPage;
