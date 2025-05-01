import { useCallback, useEffect, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt" | "unsupported";

interface UseGeolocationPermissionOptions {
  onSuccess?: (coords: { latitude: number; longitude: number }) => void;
  onError?: (error: GeolocationPositionError) => void;
}

export const useGeolocationPermission = (
  options?: UseGeolocationPermissionOptions,
) => {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");

  // 권한 상태 미리 확인
  useEffect(() => {
    if (!navigator.permissions || !navigator.geolocation) {
      setPermissionState("unsupported");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        setPermissionState(status.state as PermissionState);
        status.onchange = () => {
          setPermissionState(status.state as PermissionState);
        };
      })
      .catch(() => {
        setPermissionState("unsupported");
      });
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보 기능을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        options?.onSuccess?.({ latitude, longitude });
      },
      (error) => {
        if (permissionState === "denied") {
          alert("위치 권한 요청이 차단되어 있습니다. 수동으로 허용해주세요.");
        } else {
          alert("위치 요청에 실패했습니다. 재시도 해주세요.");
        }
        options?.onError?.(error);
      },
    );
  }, [options]);

  return {
    permissionState,
    requestLocation,
  };
};
