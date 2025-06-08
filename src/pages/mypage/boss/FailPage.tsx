import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const errorMessages: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제가 취소되었어요. 다시 시도해주세요.",
  PAY_PROCESS_ABORTED:
    "결제가 실패했어요. 다시 시도하거나 고객센터로 문의해주세요.",
  REJECT_CARD_COMPANY:
    "카드사에서 결제를 거절했어요. 다른 카드로 시도해주세요.",
};

const FailPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = params.get("code") ?? "UNKNOWN_ERROR";
  const errorMessageFromQuery =
    params.get("message") ?? "오류 메시지를 불러오지 못했어요.";

  const userFriendlyMessage =
    errorMessages[errorCode] || `알 수 없는 오류가 발생했어요. (${errorCode})`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <XCircle size={64} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">결제 등록 실패</h1>
      <p className="text-gray-700 mb-1">{userFriendlyMessage}</p>
      <p className="text-sm text-gray-500 mb-6">({errorMessageFromQuery})</p>
      <button
        onClick={() => navigate("/boss/subscribe")}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        다시 시도하기
      </button>
    </div>
  );
};

export default FailPage;
