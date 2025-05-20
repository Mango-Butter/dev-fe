import { useEffect, useRef } from "react";

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
    if (typeof window === "undefined" || !window.kakao || !mapRef.current)
      return;

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

    // 🚨 DOM 사이즈 변화가 있었을 경우 강제로 다시 그리기
    setTimeout(() => {
      map.relayout();
      map.setCenter(center);
    }, 100); // DOM 완성 후 약간의 딜레이
  }, [latitude, longitude, radiusMeters]);

  return <div ref={mapRef} className="w-full h-full rounded-lg border" />;
};

export default GpsMapPreview;
