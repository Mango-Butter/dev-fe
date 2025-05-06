import { useLayout } from "../../hooks/useLayout.ts";

const AttendanceSettingPage = () => {
  useLayout({
    title: "출퇴근 방식 설정",
    theme: "plain",
    bottomNavVisible: false,
  });
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">출퇴근 방식 설정</h1>
      <p>이 페이지에서 출퇴근 방식 설정를 확인하거나 수정할 수 있습니다.</p>
    </div>
  );
};

export default AttendanceSettingPage;
