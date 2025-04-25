// src/utils/kakaoGeocoder.ts

interface AddressSearchResult {
  x: string; // longitude
  y: string; // latitude
  address_name?: string;
  road_address_name?: string;
  [key: string]: any; // 기타 필드 허용
}

type AddressSearchStatus = "OK" | "ZERO_RESULT" | "ERROR";

export const getCoordsFromAddress = (
  address: string,
): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao?.maps?.services) {
      return reject("⚠️ Kakao 지도 SDK가 아직 로드되지 않았습니다.");
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(
      address,
      (result: AddressSearchResult[], status: AddressSearchStatus) => {
        if (status === "OK" && result.length > 0) {
          const { x, y } = result[0]; // x: longitude, y: latitude
          resolve({ latitude: parseFloat(y), longitude: parseFloat(x) });
        } else {
          reject("❌ 주소 변환에 실패했습니다.");
        }
      },
    );
  });
};
