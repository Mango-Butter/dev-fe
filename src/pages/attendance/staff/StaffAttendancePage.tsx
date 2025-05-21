import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { useLayout } from "../../../hooks/useLayout.ts";
import GpsMapPreview from "../../../components/common/GpsMapPreview.tsx";
import { clockIn, clockOut } from "../../../api/staff/attendance.ts";
import Button from "../../../components/common/Button.tsx";
import { schemaUnion } from "../../../schemas/attendanceSchema.ts";
import { getKoreaISOString } from "../../../utils/date.ts";

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

  const handleSubmit = async () => {
    if (!isValid || !selectedStore) return;
    const parsed = {
      ...validate.data,
      scheduleId: Number(validate.data.scheduleId),
    };

    try {
      if (mode === "clock-in") {
        await clockIn(selectedStore.storeId, parsed);
        alert("출근이 완료되었습니다.");
      } else {
        await clockOut(selectedStore.storeId, parsed);
        alert("퇴근이 완료되었습니다.");
      }
      await qrInstanceRef.current?.stop();
      await qrInstanceRef.current?.clear();

      navigate("/staff");
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
          setLocationFetchedAt(getKoreaISOString());
        },
        (err) => {
          console.error("위치 권한 오류:", err);
          alert("위치 정보를 가져오는 데 실패했습니다.");
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
          : "QR 출근",
    "clock-out":
      attendanceMethod === "QR"
        ? "QR 퇴근"
        : attendanceMethod === "GPS"
          ? "GPS 퇴근"
          : "QR 퇴근",
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
      <div className="w-full flex flex-col gap-9">
        <div className="w-full aspect-square rounded-xl border-[5px] border-secondary-500 bg-grayscale-200 overflow-hidden">
          {attendanceMethod === "GPS" || attendanceMethod === "BOTH" ? (
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
          ) : attendanceMethod === "QR" ? (
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

        {attendanceMethod === "QR" ? (
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
        ) : (
          <div className="w-full p-5 rounded-xl border border-secondary-500 body-2 text-grayscale-600 shadow-blue-shadow">
            <p>매장 내와 자신의 GPS 위치를 비교하여 매장 출퇴근을 확인해요.</p>
            <p>
              자신의 현재 위치와 GPS 내 위치가 다른 경우 페이지 새로고침 후 다시
              시도하세요.
            </p>
          </div>
        )}

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
