import { useEffect, RefObject } from "react";

/**
 * ref에 해당하는 요소 밖을 클릭했을 때 handler를 실행하는 훅
 * @param ref 클릭 이벤트를 감지할 요소의 ref
 * @param handler 클릭 이벤트가 발생했을 때 실행할 함수
 */
function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // ref에 해당하는 요소가 없거나, 클릭한 요소가 ref에 해당하는 요소 내부에 있으면 핸들러를 실행하지 않음
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;
