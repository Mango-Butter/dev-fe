import { useEffect, useState } from "react";
import PWAPrompt from "react-ios-pwa-prompt";

export default function UnifiedPWAPrompt() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isiOS = /iPhone|iPad|iPod/.test(ua);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = localStorage.getItem("pwaInstallDismissed");

    setIsIOS(isiOS);
    setIsStandalone(standalone);

    if (standalone || dismissed === "true") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallModal(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "dismissed") {
          localStorage.setItem("pwaInstallDismissed", "true");
        }
        setDeferredPrompt(null);
        setShowInstallModal(false);
      });
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwaInstallDismissed", "true");
    setShowInstallModal(false);
  };

  if (isStandalone) return null;

  return (
    <>
      {isIOS && (
        <PWAPrompt
          promptOnVisit={1}
          timesToShow={1}
          copyTitle="앱 설치하기 (iOS)"
          copySubtitle="홈 화면에 추가하고 푸시 알림을 받아보세요."
          copyDescription="이 웹 앱은 설치 없이도 홈 화면에 추가해 사용할 수 있어요."
          copyShareStep="하단의 공유 버튼을 눌러주세요."
          copyAddToHomeScreenStep="'홈 화면에 추가'를 눌러주세요."
          appIconPath="/logo-192x192.png"
          isShown
        />
      )}

      {!isIOS && showInstallModal && (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-xl">
            <img
              src="/logo-192x192.png"
              alt="앱 아이콘"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              앱 설치하고 푸시 알림 받기
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              홈 화면에 설치하고
              <br />더 빠르게 이벤트 소식을 받아보세요.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
            >
              설치하기
            </button>
            <button
              onClick={handleDismiss}
              className="mt-3 text-sm text-gray-500 hover:underline"
            >
              나중에 할게요
            </button>
          </div>
        </div>
      )}
    </>
  );
}
