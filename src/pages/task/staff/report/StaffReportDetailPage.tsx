import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffWorkReportDetail } from "../../../../api/staff/report";
import { toast } from "react-toastify";
import { useLayout } from "../../../../hooks/useLayout";
import { format } from "date-fns";
import { WorkReportItem } from "../../../../types/report.ts";
import useStaffStoreStore from "../../../../stores/useStaffStoreStore.ts";
import { isValidStoreId } from "../../../../utils/store.ts";

const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  return format(date, "yyyy-MM-dd HH:mm");
};

const StaffReportDetailPage = () => {
  const { workReportId } = useParams();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;
  const navigate = useNavigate();
  const [report, setReport] = useState<WorkReportItem | null>(null);

  useLayout({
    title: "보고사항 상세",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate(-1),
    rightIcon: null,
  });

  const fetchReport = async () => {
    if (!workReportId || !isValidStoreId(storeId)) return;
    try {
      const data = await getStaffWorkReportDetail(
        storeId,
        Number(workReportId),
      );
      setReport(data);
    } catch (err) {
      console.error("보고사항 상세 조회 실패", err);
      toast.error("보고사항을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [workReportId]);

  if (!report) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="w-full p-5 flex flex-col h-full justify-start gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <img
            src={report.staff.profileImageUrl}
            alt={report.staff.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="body-2 text-grayscale-700">{report.staff.name}</span>
          <span className="body-3 text-grayscale-400">
            {formatDateTime(report.createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap body-2 text-grayscale-900">
          {report.content}
        </p>
      </div>

      {report.reportImageUrl && (
        <img
          src={report.reportImageUrl}
          alt="보고 이미지"
          className="w-full rounded-lg object-cover"
        />
      )}
    </div>
  );
};

export default StaffReportDetailPage;
