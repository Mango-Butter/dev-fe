import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useUserStore } from "../../../stores/userStore.ts";
import { toast } from "react-toastify";

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY!;

const SubscribePage = () => {
  const { user } = useUserStore();
  const customerKey = "P9kwY25Ns4F1wIHN7j8Rn";
  const [payment, setPayment] = useState<any>(null);
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const instance = tossPayments.payment({ customerKey });
        setPayment(instance);
      } catch (error) {
        console.error("TossPayments 초기화 오류:", error);
      }
    };

    fetchPayment();
  }, []);

  const requestBillingAuth = async () => {
    if (!payment) {
      toast.error("결제 모듈이 아직 초기화되지 않았어요.");
      return;
    }
    if (!user) {
      toast.error("사용자를 찾을 수 없어요");
      return;
    }

    try {
      await payment.requestBillingAuth({
        method: "CARD",
        successUrl: `${window.location.origin}/boss/subscribe/success`,
        failUrl: `${window.location.origin}/boss/subscribe/fail`,
        customerEmail: user.email,
        customerName: user.name,
      });
    } catch (error: any) {
      if (error.code === "USER_CANCEL") {
        alert("사용자가 결제를 취소했어요.");
      } else {
        console.error("결제 요청 실패:", error);
        alert("결제 요청 중 문제가 발생했어요.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-6">정기 구독 시작하기</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium px-6 py-3 rounded-xl transition"
        onClick={requestBillingAuth}
      >
        결제 수단 등록하기
      </button>
    </div>
  );
};

export default SubscribePage;
