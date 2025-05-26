import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "../../../hooks/useLayout.ts";
import { useEffect, useState } from "react";
import { ContractDetailResponse } from "../../../types/contract.ts";
import { formatFullDateWithTime } from "../../../utils/date.ts";
import { weekdayKorean } from "../../../types/staff.ts";
import {
  fetchStaffContractPdfDownloadUrl,
  fetchStaffContractPdfViewUrl,
  getStaffContractDetail,
  submitStaffContractSignature,
} from "../../../api/staff/constract.ts";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import SignaturePadSheetStaff from "./SignaturePadSheetStaff.tsx";
import Button from "../../../components/common/Button.tsx";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { parseDateStringToKST } from "../../../libs/date.ts";

const ContractViewStaffPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedStore } = useStaffStoreStore();
  const [contract, setContract] = useState<ContractDetailResponse | null>(null);
  const { setBottomSheetContent, setBottomSheetOpen } = useBottomSheetStore();
  const [tempSignatureImage, setTempSignatureImage] = useState<string | null>(
    null,
  );
  const [signatureKey, setSignatureKey] = useState<string | null>(null);

  useLayout({
    title: "망고보스 표준 근로계약서",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate("/staff"),
    rightIcon: null,
  });

  useEffect(() => {
    if (!id) {
      alert("계약서를 찾지 못했습니다.");
      navigate("/staff", { replace: true });
      return;
    }

    if (!selectedStore) {
      alert("선택된 매장이 없습니다.");
      navigate("/staff", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getStaffContractDetail(
          selectedStore.storeId,
          parseInt(id),
        );
        setContract(data);
      } catch (err) {
        console.error("계약서 불러오기 실패:", err);
        navigate("/staff", { replace: true });
      }
    };

    fetchData();
  }, [id, selectedStore, navigate]);

  const handlePdfView = async () => {
    if (!id || !selectedStore) return;
    try {
      const { url } = await fetchStaffContractPdfViewUrl(
        selectedStore.storeId,
        parseInt(id),
      );
      window.open(url, "_blank");
    } catch (err) {
      console.error("PDF 보기 URL 요청 실패", err);
    }
  };

  const handlePdfDownload = async () => {
    if (!id || !selectedStore) return;
    try {
      const { url } = await fetchStaffContractPdfDownloadUrl(
        selectedStore.storeId,
        parseInt(id),
      );
      window.open(url, "_blank"); // 또는 download 속성 있는 a 태그 만들어도 됨
    } catch (err) {
      console.error("PDF 다운로드 URL 요청 실패", err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-24 px-5 py-6 bg-white">
      <div className="inline-flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-grayscale-100 rounded-lg title-1 text-grayscale-900">
            {contract?.contractData.bossName || "사업주"}
          </div>
          <div className="body-1 text-grayscale-700">
            (이하 “사업주”라 함)과(와)
          </div>
          <div className="px-3 py-1.5 bg-grayscale-100 rounded-lg title-1 text-grayscale-900">
            {contract?.contractData.staffName || "근로자"}
          </div>
          <div className="body-1 text-grayscale-700">
            (이하 “근로자”라 함)은 다음과 같이 근로계약을 체결한다.
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="inline-flex items-start gap-5">
            <div className="title-1 text-grayscale-900 min-w-fit">
              1. 근로계약기간
            </div>
            <div className="px-3 py-1.5 bg-grayscale-100 rounded-lg title-1 text-grayscale-900">
              {contract?.contractData.contractStart} ~{" "}
              {contract?.contractData.contractEnd}
            </div>
          </div>

          <div className="inline-flex items-start gap-5">
            <div className="title-1 text-grayscale-900 min-w-fit">
              2. 근무 장소
            </div>
            <div className="px-3 py-1.5 bg-grayscale-100 rounded-lg title-1 text-grayscale-900">
              {contract?.contractData.storeAddress}
            </div>
          </div>

          <div className="inline-flex items-start gap-5">
            <div className="title-1 text-grayscale-900 min-w-fit">3. 업무</div>
            <div className="px-3 py-1.5 bg-grayscale-100 rounded-lg title-1 text-grayscale-900">
              {contract?.contractData.duty}
            </div>
          </div>

          <div className="inline-flex items-start gap-5">
            <div className="title-1 text-grayscale-900 min-w-fit">
              4. 근무 요일 및 시간
            </div>
            <div className="flex flex-col gap-1">
              {contract?.contractData.workSchedules.map((ws) => (
                <div
                  key={ws.dayOfWeek}
                  className="px-3 py-1.5 bg-grayscale-100 rounded-lg title-1 text-grayscale-900"
                >
                  {weekdayKorean[ws.dayOfWeek]} {ws.startTime} ~ {ws.endTime}
                </div>
              ))}
            </div>
          </div>

          <div className="inline-flex items-start gap-5">
            <div className="title-1 text-grayscale-900">5. 시급</div>
            <div className="px-3 py-1.5 bg-grayscale-100 rounded-lg title-1 text-grayscale-900">
              {contract?.contractData.hourlyWage.toLocaleString()} 원
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="title-1 text-grayscale-900">근로계약서 교부</div>
          <div className="body-1 text-grayscale-500">
            사업주는 근로계약을 체결함과 동시에 본 계약서를 사본하여 근로자의
            교부요구와 관계없이 근로자에게 교부함 (근로기준법 제17조 이행)
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="title-1 text-grayscale-900">기타</div>
          <div className="body-1 text-grayscale-500">
            이 계약에 정함이 없는 사항은 근로기준법령에 의함
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 w-full">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 min-w-[80px] title-1 text-grayscale-900">
            <div>매장명</div>
            <div>사업자번호</div>
            <div>매장 주소</div>
            <div>대표자명</div>
          </div>
          <div className="flex flex-col gap-2 title-1 text-grayscale-900">
            <div>{contract?.contractData.storeName}</div>
            <div>{contract?.contractData.businessNumber}</div>
            <div>{contract?.contractData.storeAddress}</div>
            <div>{contract?.contractData.bossName}</div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 min-w-[80px] title-1 text-grayscale-900">
            <div>근로자 성명</div>
            <div>연락처</div>
          </div>
          <div className="flex flex-col gap-2 title-1 text-grayscale-900">
            <div>{contract?.contractData.staffName}</div>
            <div>{contract?.contractData.staffPhone}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <div className="title-1 text-grayscale-900">사장님 서명</div>
            <div className="h-32 px-6 py-3 bg-white rounded-xl border border-grayscale-400 flex justify-center items-center">
              {contract?.bossSignature.url ? (
                <img
                  src={contract.bossSignature.url}
                  alt="사장님 서명"
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-grayscale-400">서명 없음</span>
              )}
            </div>
            <span className="text-xs text-grayscale-500">
              만료일:{" "}
              {contract?.bossSignature.expiresAt
                ? formatFullDateWithTime(
                    parseDateStringToKST(contract.bossSignature.expiresAt),
                  )
                : "-"}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="title-1 text-grayscale-900">근로자 서명</div>
            <div
              className="h-32 px-6 py-3 bg-white rounded-xl border border-grayscale-400 flex justify-center items-center cursor-pointer"
              onClick={() => {
                if (!contract?.staffSignature?.url) {
                  setBottomSheetContent(
                    <SignaturePadSheetStaff
                      onComplete={({ base64, signatureKey }) => {
                        setTempSignatureImage(base64);
                        setSignatureKey(signatureKey);
                        setBottomSheetOpen(false);
                      }}
                    />,
                    { title: "근로자 서명 등록" },
                  );
                }
              }}
            >
              {contract?.staffSignature?.url ? (
                <img
                  src={contract.staffSignature.url}
                  alt="근로자 서명"
                  className="h-full object-contain"
                />
              ) : tempSignatureImage ? (
                <img
                  src={tempSignatureImage}
                  alt="임시 서명"
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-grayscale-400">서명하기</span>
              )}
            </div>
            <span className="text-xs text-grayscale-500">
              만료일:{" "}
              {contract?.staffSignature?.expiresAt
                ? formatFullDateWithTime(
                    parseDateStringToKST(contract.staffSignature.expiresAt),
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="w-full mb-8">
          {contract?.staffSignature?.url ? (
            <div className="flex flex-col gap-4">
              <Button
                size="sm"
                theme="outline"
                state="default"
                className="w-full"
                onClick={handlePdfView}
              >
                PDF로 보기
              </Button>
              <Button
                size="sm"
                theme="ghost2"
                state="default"
                className="w-full"
                onClick={handlePdfDownload}
              >
                PDF 다운로드
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              theme="secondary"
              state={signatureKey ? "default" : "disabled"}
              className="w-full"
              disabled={!signatureKey}
              onClick={async () => {
                if (!id || !selectedStore || !signatureKey) return;
                try {
                  await submitStaffContractSignature(
                    selectedStore.storeId,
                    parseInt(id),
                    signatureKey,
                  );
                  alert("계약서가 성공적으로 제출되었습니다.");
                  window.location.reload();
                } catch (err) {
                  console.error("제출 실패", err);
                }
              }}
            >
              계약서 제출하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractViewStaffPage;
