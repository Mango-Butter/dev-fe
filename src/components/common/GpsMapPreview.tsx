import { useEffect, useRef } from "react";
import { loadKakaoMapScript } from "../../utils/loadKakaoMapScript.ts";

interface GpsMapPreviewProps {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

const GpsMapPreview = ({
  latitude,
  longitude,
  radiusMeters = 0,
}: GpsMapPreviewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      await loadKakaoMapScript(); // ✅ 지도 SDK 로딩 보장

      if (!window.kakao || !mapRef.current) return;

      const kakao = window.kakao;
      const center = new kakao.maps.LatLng(latitude, longitude);

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });

      new kakao.maps.Marker({ position: center, map });

      if (radiusMeters > 0) {
        new kakao.maps.Circle({
          center,
          radius: radiusMeters,
          strokeWeight: 2,
          strokeColor: "#4A90E2",
          strokeOpacity: 0.8,
          fillColor: "#4A90E2",
          fillOpacity: 0.2,
          map,
        });
      }

      // DOM 렌더링 완료 후 레이아웃 재계산
      setTimeout(() => {
        map.relayout();
        map.setCenter(center);
      }, 100);
    };

    initMap();
  }, [latitude, longitude, radiusMeters]);

  return (
    <div
      ref={mapRef}
      className="w-full aspect-square rounded-lg border border-gray-200"
    />
  );
};

export default GpsMapPreview;
