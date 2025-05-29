// src/libs/fcm/messaging.ts
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseApp } from "./firebase";
import { toast } from "react-toastify";

const messaging = getMessaging(firebaseApp);

let hasInitialized = false;

export const initForegroundFCM = () => {
  if (hasInitialized) return;
  hasInitialized = true;

  onMessage(messaging, (payload) => {
    console.log("[FCM] Foreground message received:", payload);

    const { title, body } = payload.notification || {};

    if (title || body) {
      toast.info(
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm">{body}</p>
        </div>,
        {
          icon: <span>🔔</span>,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );
    } else {
      console.warn("[FCM] 알림 payload가 비어있습니다.");
    }
  });
};

export { messaging };
