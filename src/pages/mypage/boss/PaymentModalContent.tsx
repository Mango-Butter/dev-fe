// src/components/subscription/PaymentModalContent.tsx
import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useUserStore } from "../../../stores/userStore.ts";
import { fetchCustomerKey } from "../../../api/boss/payment.ts";
import { toast } from "react-toastify";
import { PlanCard } from "./PlanCard.tsx";

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY!;

const PaymentModalContent = () => {
  const { user } = useUserStore();
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { customerKey } = await fetchCustomerKey();
        const tossPayments = await loadTossPayments(clientKey);
        const instance = tossPayments.payment({ customerKey });
        setPayment(instance);
      } catch (error) {
        console.error("결제 모듈 초기화 오류:", error);
        toast.error("결제 모듈 초기화에 실패했어요.");
      }
    };

    init();
  }, []);

  const requestBillingAuth = async () => {
    if (!payment || !user) {
      toast.error("결제 초기화 또는 사용자 정보가 부족합니다.");
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
    <div className="flex flex-col gap-4">
      <PlanCard
        title="PREMIUM PLAN"
        price="월 19,900원"
        features={[
          "모든 BASIC 기능 포함",
          "멀티매장 관리",
          "알바생 추가 무제한",
        ]}
      />
      <p className="text-sm text-gray-600">
        토스페이를 통해 결제 수단을 등록해주세요. 등록 후 구독 결제가 자동으로
        진행됩니다.
      </p>
      <button
        onClick={requestBillingAuth}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition"
      >
        결제 수단 등록하기
      </button>
    </div>
  );
};

export default PaymentModalContent;
