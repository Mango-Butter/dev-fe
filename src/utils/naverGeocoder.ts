// src/utils/naverGeocoder.ts

export const getCoordsFromAddress = async (
  address: string,
): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!window.naver?.maps?.Service) {
      return reject("⚠️ Naver 지도 서비스가 로드되지 않았습니다.");
    }

    window.naver.maps.Service.geocode(
      { query: address },
      (status: any, response: any) => {
        if (status === window.naver.maps.Service.Status.ERROR) {
          return alert("Something wrong!");
        }

        const { x, y } = response.v2.addresses[0];
        resolve({ latitude: parseFloat(y), longitude: parseFloat(x) });
      },
    );
  });
};
