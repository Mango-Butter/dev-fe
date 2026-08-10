// components/common/FullScreenLoading.tsx
// Suspense fallback으로 초기(eager) 로드되는 컴포넌트라 의존성을 최소화한다.
// 기존 Lottie(@lottiefiles/react-lottie-player)는 gzip 84KB로 랜딩 초기 전송량의
// 최대 단일 항목이었으므로, 무의존 CSS 스피너로 대체해 초기 번들에서 제거했다.
const FullScreenLoading = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 touch-none"
      style={{
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      <div
        className="h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-primary-900"
        role="status"
        aria-label="로딩 중"
      />
    </div>
  );
};

export default FullScreenLoading;
