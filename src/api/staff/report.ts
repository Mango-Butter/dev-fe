import {
  CreateWorkReportRequest,
  WorkReportImageUploadUrlResponse,
  WorkReportItem,
} from "../../types/report.ts";
import axiosAuth from "../common/axiosAuth.ts";

// 일별 조회
export const getStaffWorkReportsByDate = async (
  storeId: number,
  date: string,
): Promise<WorkReportItem[]> => {
  const res = await axiosAuth.get(`/api/staff/stores/${storeId}/work-reports`, {
    params: { date },
  });
  return res.data.result;
};

// 작성
export const createWorkReport = async (
  storeId: number,
  data: CreateWorkReportRequest,
): Promise<WorkReportItem> => {
  const res = await axiosAuth.post(
    `/api/staff/stores/${storeId}/work-reports`,
    data,
  );
  return res.data;
};

// 보고사항 상세 조회 (알바용)
export const getStaffWorkReportDetail = async (
  storeId: number,
  workReportId: number,
): Promise<WorkReportItem> => {
  const res = await axiosAuth.get(
    `/api/staff/stores/${storeId}/work-reports/${workReportId}`,
  );
  return res.data;
};

// 보고사항 이미지 presigned URL 발급
export const getWorkReportImageUploadUrl = async (
  storeId: number,
  extension: string,
  contentType: string,
): Promise<WorkReportImageUploadUrlResponse> => {
  const res = await axiosAuth.get(
    `/api/staff/stores/${storeId}/work-reports/work-report-image/upload-url`,
    {
      params: { extension, contentType },
    },
  );
  return res.data;
};

export const uploadImageToPresignedUrl = async (
  uploadUrl: string,
  file: File,
): Promise<void> => {
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
};
