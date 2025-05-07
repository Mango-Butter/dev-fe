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
      level: 3, // 1(가장 확대) ~ 14(가장 축소)
    });

    // 마커 표시
    new kakao.maps.Marker({
      position: center,
      map,
    });

    // 반지름 원 표시
    new kakao.maps.Circle({
      center,
      radius: radiusMeters, // 단위: 미터
      strokeWeight: 2,
      strokeColor: "#4A90E2",
      strokeOpacity: 0.8,
      fillColor: "#4A90E2",
      fillOpacity: 0.2,
      map,
    });

    map.setCenter(center);
  }, [latitude, longitude, radiusMeters]);

  return <div ref={mapRef} className="w-full h-80 rounded-lg border" />;
};

export default GpsMapPreview;
