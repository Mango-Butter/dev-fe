import { useCallback, useEffect, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt" | "unsupported";

interface UseCameraPermissionOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCameraPermission = (options?: UseCameraPermissionOptions) => {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");

  // 권한 상태 미리 확인
  useEffect(() => {
    if (!navigator.permissions) {
      setPermissionState("unsupported");
      return;
    }

    navigator.permissions
      .query({ name: "camera" as PermissionName })
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

  // 권한 요청
  const requestCamera = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("이 브라우저는 카메라 권한을 지원하지 않습니다.");
      setPermissionState("unsupported");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop()); // 사용 종료
        options?.onSuccess?.();
      })
      .catch((error) => {
        alert("카메라 접근이 거부되었습니다. 브라우저 설정에서 허용해주세요.");
        options?.onError?.(error);
      });
  }, [options]);

  return { permissionState, requestCamera };
};
