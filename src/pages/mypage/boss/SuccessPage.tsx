import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { registerBillingKey } from "../../../api/boss/payment";
import { useUserStore } from "../../../stores/userStore";
import { createSubscription } from "../../../api/boss/subscription.ts";
import { toast } from "react-toastify";
import Spinner from "../../../components/common/Spinner.tsx";
import PartyIcon from "../../../components/icons/PartyIcon.tsx";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";

const SuccessPage = () => {
  const { user } = useUserStore();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const authKey = params.get("authKey");
    const customerKey = params.get("customerKey");

    if (!authKey || !customerKey || !user) {
      setStatus("error");
      return;
    }

    registerBillingKey(authKey, customerKey)
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
    setStatus("success");
  }, [params, navigate, user]);

  const handleCreateSubscription = async () => {
    setIsSubmitting(true);
    try {
      await createSubscription("PREMIUM");
      toast.success("PREMIUM PLAN으로 업그레이드 되었습니다!");
      navigate("/boss/subscribe");
    } catch (error) {
      console.error("구독 생성 중 오류가 발생했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-xl font-semibold mb-2">카드 등록 중입니다...</h1>
        <p className="text-gray-500">잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center gap-4">
        <PartyIcon />
        <h1 className="text-2xl font-bold text-blue-500 mb-2">
          카드 등록 완료
        </h1>
        <p className="text-gray-700 mb-6">
          정기 결제를 위한 카드 등록이 <br />
          성공적으로 완료되었어요.
        </p>
        <button
          onClick={handleCreateSubscription}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
            isSubmitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? <Spinner /> : "지금 바로 플랜 업그레이드"}
        </button>
      </div>
    );
  }

  // status === "error"
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-4">
      <ErrorIcon className="w-16 h-16" fill="#ef4444" />
      <h1 className="text-2xl font-bold text-red-500 mb-2">등록 실패</h1>
      <p className="text-gray-600 mb-6">
        카드 등록 중 문제가 발생했어요.
        <br /> 다시 시도해주세요.
      </p>
      <button
        onClick={() => navigate("/boss/subscribe")}
        className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg"
      >
        다시 시도하기
      </button>
    </div>
  );
};

export default SuccessPage;
