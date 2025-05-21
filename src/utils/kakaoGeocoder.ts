// src/utils/kakaoGeocoder.ts

import { loadKakaoMapScript } from "./loadKakaoMapScript.ts";

interface AddressSearchResult {
  x: string; // longitude
  y: string; // latitude
  address_name?: string;
  road_address_name?: string;
  [key: string]: any; // 기타 필드 허용
}

type AddressSearchStatus = "OK" | "ZERO_RESULT" | "ERROR";

export const getCoordsFromAddress = async (
  address: string,
): Promise<{ latitude: number; longitude: number }> => {
  await loadKakaoMapScript(); // ✅ Kakao SDK 로드 보장

  return new Promise((resolve, reject) => {
    if (!window.kakao?.maps?.services) {
      return reject("⚠️ Kakao 지도 서비스가 로드되지 않았습니다.");
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(
      address,
      (result: AddressSearchResult[], status: AddressSearchStatus) => {
        if (status === "OK" && result.length > 0) {
          const { x, y } = result[0];
          resolve({ latitude: parseFloat(y), longitude: parseFloat(x) });
        } else {
          reject("❌ 주소 변환에 실패했습니다.");
        }
      },
    );
  });
};
