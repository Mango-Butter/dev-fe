// components/QrScanner.tsx

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QrScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText, decodedResult) => {
        console.log("QR 스캔 성공 ✅", decodedText);
        alert(`출퇴근 인증 완료! QR 내용: ${decodedText}`);
        scanner.clear(); // 한 번만 인식하게 정리
      },
      (error) => {
        // 인식 실패시 무시
        // console.warn("QR 인식 실패:", error);
      },
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">📷 QR 출퇴근 인증</h2>
      <div id="qr-reader" className="w-full max-w-md"></div>
    </div>
  );
}
