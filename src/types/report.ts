// 보고 대상: 사장에게 보고 or 알바생에게 전달
export type WorkReportTargetType = "TO_BOSS" | "TO_STAFF";

// 보고사항 공통 구조 (리스트 + 상세 공용)
export interface WorkReportItem {
  workReportId: number;
  content: string;
  reportImageUrl: string | null;
  createdAt: string;
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  targetType: WorkReportTargetType;
}

// 리스트 조회 응답 (사장/알바 공용)
export interface WorkReportListResponse {
  result: WorkReportItem[];
}

// 보고사항 작성 요청
export interface CreateWorkReportRequest {
  content: string;
  reportImageUrl: string | null;
  targetType: WorkReportTargetType;
}

export interface WorkReportImageUploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  expiresAt: string; // ISO datetime
}
