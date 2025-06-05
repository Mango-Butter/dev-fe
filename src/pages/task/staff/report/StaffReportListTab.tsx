import React from "react";
import { WorkReportItem } from "../../../../types/report.ts";
import StaffReportCard from "./StaffReportCard.tsx"; // 카드 컴포넌트 별도로 구성

interface StaffReportListTabProps {
  reports: WorkReportItem[];
  isLoading: boolean;
}

const StaffReportListTab: React.FC<StaffReportListTabProps> = ({
  reports,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center text-grayscale-500 py-8">
        등록된 보고사항이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <StaffReportCard key={report.workReportId} {...report} />
      ))}
    </div>
  );
};

export default StaffReportListTab;
