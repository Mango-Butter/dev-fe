// src/libs/fcm/requestPermission.ts
import { getToken } from "firebase/messaging";
import { messaging } from "./messaging.tsx";
import { toast } from "react-toastify";
import { showConfirm } from "../showConfirm.ts";

export const requestUserPermission = async (
  setIsLoading?: (val: boolean) => void,
) => {
  try {
    if (!("Notification" in window)) {
      toast.error("이 브라우저는 알림을 지원하지 않습니다.");
      return;
    }

    const shouldProceed = await showConfirm({
      title: "알림 권한 요청",
      text: `근무 스케줄 변경, 특이사항 보고 등 
      실시간 알림을 받기 위해 알림 권한을 허용해주세요.`,
      icon: "info",
      confirmText: "허용하기",
      cancelText: "다음에",
    });

    if (!shouldProceed) return;

    const permission: NotificationPermission = await new Promise((resolve) =>
      Notification.requestPermission(resolve),
    );

    if (permission !== "granted") {
      toast.info("알림 권한이 허용되지 않았습니다.");
      return;
    }

    setIsLoading?.(true);

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      localStorage.setItem("fcmToken", token);
      toast.success("알림 기능이 활성화되었습니다.");
    } else {
      toast.error("알림기능 설정에 실패했습니다. 관리자에게 문의하세요.");
    }
  } catch (err) {
    console.error("[FCM] 알림 토큰 발급 실패:", err);
    toast.error(
      "알림 기능이 활성화 중 오류가 발생했습니다. 관리자에게 문의하세요.",
    );
  } finally {
    setIsLoading?.(false);
  }
};
