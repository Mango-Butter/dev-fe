import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { useLayout } from "../../../hooks/useLayout.ts";
import GpsMapPreview from "../../../components/common/GpsMapPreview.tsx";
import { clockIn, clockOut } from "../../../api/staff/attendance.ts";
import Button from "../../../components/common/Button.tsx";
import { schemaUnion } from "../../../schemas/attendanceSchema.ts";
import { toast } from "react-toastify";
import { getKSTISOString } from "../../../libs/date.ts";
import ApproveIcon from "../../../components/icons/ApproveIcon.tsx";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";

const StaffAttendancePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { selectedStore } = useStaffStoreStore();

  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationFetchedAt, setLocationFetchedAt] = useState<string | null>(
    null,
  );
  const [qrCode, setQrCode] = useState("");

  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<Html5Qrcode | null>(null);

  const mode = params.get("mode"); // "clock-in" | "clock-out"
  const scheduleId = params.get("scheduleId");
  const attendanceMethod = selectedStore?.attendanceMethod;

  const needsLocation =
    attendanceMethod === "GPS" || attendanceMethod === "BOTH";

  const gpsReady = currentPosition && locationFetchedAt;

  const handleSubmit = async () => {
    if (!isValid || !selectedStore) return;
    const parsed = {
      ...validate.data,
      scheduleId: Number(validate.data.scheduleId),
    };

    try {
      if (mode === "clock-in") {
        await clockIn(selectedStore.storeId, parsed);
        toast.success("출근이 완료되었습니다.");
      } else {
        await clockOut(selectedStore.storeId, parsed);
        toast.success("퇴근이 완료되었습니다.");
      }

      navigate("/staff", { replace: true });

      setTimeout(() => {
        qrInstanceRef.current
          ?.stop()
          .then(() => qrInstanceRef.current?.clear())
          .catch((err) => console.warn("QR 종료 오류:", err));
      }, 300);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (needsLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLocationFetchedAt(getKSTISOString());
        },
        (err) => {
          console.error(err);
          toast.error("위치 정보를 가져오는 데 실패했습니다.");
        },
      );
    }
  }, [needsLocation]);

  useEffect(() => {
    if (!(attendanceMethod === "QR" || attendanceMethod === "BOTH")) return;
    if (!qrRef.current) return;

    const rect = qrRef.current.getBoundingClientRect();
    const minSize = Math.floor(Math.min(rect.width, rect.height) * 0.6);

    const qr = new Html5Qrcode("qr-reader");
    qrInstanceRef.current = qr;

    qr.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: minSize, height: minSize },
      },
      (decodedText) => {
        setQrCode(decodedText);
      },
      (error) => {
        console.warn("QR 인식 실패:", error);
      },
    );

    return () => {
      qrInstanceRef.current
        ?.stop()
        .then(() => qrInstanceRef.current?.clear())
        .catch((err) => console.warn("QR 종료 오류:", err));
    };
  }, [attendanceMethod]);

  if (!selectedStore) return null;

  const titleMap = {
    "clock-in":
      attendanceMethod === "QR"
        ? "QR 출근"
        : attendanceMethod === "GPS"
          ? "GPS 출근"
          : attendanceMethod === "BOTH"
            ? "QR•GPS 출근"
            : "출근",
    "clock-out":
      attendanceMethod === "QR"
        ? "QR 퇴근"
        : attendanceMethod === "GPS"
          ? "GPS 퇴근"
          : attendanceMethod === "BOTH"
            ? "QR•GPS 퇴근"
            : "퇴근",
  };

  useLayout({
    title: titleMap[mode as keyof typeof titleMap] || "출퇴근",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate("/staff"),
    rightIcon: null,
  });

  const validate = schemaUnion.safeParse({
    attendanceMethod,
    scheduleId,
    qrCode,
    latitude: currentPosition?.latitude,
    longitude: currentPosition?.longitude,
    locationFetchedAt,
  });

  const isValid = validate.success;

  return (
    <div className="w-full p-4">
      <div className="w-full flex flex-col gap-5">
        <div className="w-full aspect-square rounded-xl border-[5px] border-secondary-500 bg-grayscale-200 overflow-hidden">
          {attendanceMethod === "GPS" ? (
            currentPosition ? (
              <GpsMapPreview
                latitude={currentPosition.latitude}
                longitude={currentPosition.longitude}
                radiusMeters={0}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                위치 정보를 받아오는 중입니다...
              </div>
            )
          ) : attendanceMethod === "QR" || attendanceMethod === "BOTH" ? (
            <>
              <div
                id="qr-reader"
                ref={qrRef}
                className="w-full h-full min-h-[200px] min-w-[200px]"
              />
              {qrCode && (
                <p className="text-center text-sm text-green-600">
                  QR 스캔 완료
                </p>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
              위치 또는 QR 정보 없음
            </div>
          )}
        </div>

        {attendanceMethod === "BOTH" && (
          <div className="w-full flex justify-center gap-4 items-center p-4 rounded-xl border border-secondary-500 body-2 shadow-blue-shadow">
            <div
              className={`flex items-center gap-2 text-sm ${
                qrCode ? "text-green-600" : "text-gray-700"
              }`}
            >
              {qrCode ? <ApproveIcon /> : <ErrorIcon />}
              QR 스캔 {qrCode ? "확인됨" : "필요"}
            </div>
            <div
              className={`flex items-center gap-2 text-sm ${
                gpsReady ? "text-green-600" : "text-gray-700"
              }`}
            >
              {gpsReady ? <ApproveIcon /> : <ErrorIcon />}
              {gpsReady ? "GPS 위치 확인됨" : "위치 새로고침 필요"}
            </div>
          </div>
        )}

        {attendanceMethod === "QR" && (
          <div className="w-full flex justify-center items-center p-4 rounded-xl border border-secondary-500 body-2 shadow-blue-shadow">
            <div
              className={`flex items-center gap-2 text-sm ${
                qrCode ? "text-green-600" : "text-gray-700"
              }`}
            >
              {qrCode ? <ApproveIcon /> : <ErrorIcon />}
              QR 스캔 {qrCode ? "확인됨" : "필요"}
            </div>
          </div>
        )}

        {attendanceMethod === "GPS" && (
          <div className="w-full flex justify-center items-center p-4 rounded-xl border border-secondary-500 body-2 shadow-blue-shadow">
            <div
              className={`flex items-center gap-2 text-sm ${
                gpsReady ? "text-green-600" : "text-gray-700"
              }`}
            >
              {gpsReady ? <ApproveIcon /> : <ErrorIcon />}
              {gpsReady ? "GPS 위치 확인됨" : "위치 새로고침 필요"}
            </div>
          </div>
        )}

        {attendanceMethod === "BOTH" ? (
          <div className="w-full p-5 rounded-xl border border-secondary-500 body-2 text-grayscale-600 shadow-blue-shadow">
            <p>
              이 매장은 QR 스캔과 GPS 위치 정보를 모두 활용해 출퇴근을 확인해요.
            </p>
            <p>
              매장에 도착하면 QR을 스캔하고, 위치 정보도 자동으로 함께 기록돼요.
            </p>
            <p>
              두 가지 방식이 모두 만족되어야 출퇴근이 정상적으로 기록되므로,
              스캔 후 위치 정보 허용 상태도 꼭 확인하세요.
            </p>
          </div>
        ) : attendanceMethod === "QR" ? (
          <div className="w-full p-5 rounded-xl border border-secondary-500 body-2 text-grayscale-600 shadow-blue-shadow">
            <p>매장에 도착하면 QR 코드를 스캔해 출근을 시작할 수 있어요.</p>
            <p>
              퇴근할 땐 QR 코드를 한 번 더 스캔하면 출퇴근 기록이 자동으로
              저장돼요.
            </p>
            <p>
              앱에서 제공되는 QR 리더기로 매장 QR을 스캔해 출퇴근을 간편하게
              기록하세요.
            </p>
          </div>
        ) : attendanceMethod === "GPS" ? (
          <div className="w-full p-5 rounded-xl border border-secondary-500 body-2 text-grayscale-600 shadow-blue-shadow">
            <p>매장 내와 자신의 GPS 위치를 비교하여 매장 출퇴근을 확인해요.</p>
            <p>
              자신의 현재 위치와 GPS 내 위치가 다른 경우 페이지 새로고침 후 다시
              시도하세요.
            </p>
          </div>
        ) : null}
        <Button
          className="w-full mt-2"
          size="sm"
          theme="secondary"
          state={!isValid ? "disabled" : "active"}
          disabled={!isValid}
          onClick={handleSubmit}
        >
          {mode === "clock-in" ? "출근하기" : "퇴근하기"}
        </Button>
      </div>
    </div>
  );
};

export default StaffAttendancePage;
