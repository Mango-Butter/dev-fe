import { useLayout } from "../../../hooks/useLayout.ts";

const NotificationSettingPage = () => {
  useLayout({
    title: "알림 설정",
    theme: "plain",
    bottomNavVisible: false,
  });
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">알림 설정</h1>
      <p>이 페이지에서 알림 설정을 확인하거나 수정할 수 있습니다.</p>
    </div>
  );
};

export default NotificationSettingPage;
