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
    const initMap = async () => {
      if (!window.naver || !mapRef.current) return;

      const center = new window.naver.maps.LatLng(latitude, longitude);

      const map = new window.naver.maps.Map(mapRef.current, {
        center,
        zoom: 16, // level 3에 대응하는 줌 수준
      });

      new window.naver.maps.Marker({
        position: center,
        map,
      });

      if (radiusMeters > 0) {
        new window.naver.maps.Circle({
          map,
          center,
          radius: radiusMeters,
          strokeColor: "#4A90E2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4A90E2",
          fillOpacity: 0.2,
        });
      }

      // 지도 리사이즈 및 중심 재설정
      setTimeout(() => {
        window.naver.maps.Event.trigger(map, "resize");
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
