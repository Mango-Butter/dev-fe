// src/pages/boss/SubscribePage.tsx
import { useEffect, useState } from "react";
import { useLayout } from "../../../hooks/useLayout.ts";
import { toast } from "react-toastify";
import {
  deleteSubscription,
  fetchSubscriptionInfo,
  fetchSubscriptionOrderHistory,
} from "../../../api/boss/subscription.ts";
import {
  SubscriptionInfo,
  SubscriptionOrderHistory,
} from "../../../types/subscription.ts";
import { PlanCard } from "./PlanCard.tsx";
import modalStore from "../../../stores/modalStore.ts";
import PaymentModalContent from "./PaymentModalContent.tsx";
import { showConfirm } from "../../../libs/showConfirm.ts";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscribePage = () => {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null,
  );
  const [orderHistory, setOrderHistory] = useState<SubscriptionOrderHistory[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const toggleOpen = (id: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { setModalContent, setModalOpen } = modalStore();

  useLayout({
    title: "구독 설정",
    theme: "plain",
    bottomNavVisible: false,
    onBack: () => navigate("/boss/store", { replace: true }),
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const info = await fetchSubscriptionInfo();
        const history = await fetchSubscriptionOrderHistory();
        setSubscription(info);
        setOrderHistory(history);
      } catch (error) {
        console.error("구독 초기화 실패:", error);
        toast.error("구독 정보를 불러오는 중 오류가 발생했어요.");
      }
    };

    initialize();
  }, []);

  const handlePamentModalOpen = () => {
    setModalContent(<PaymentModalContent />, {
      title: "플랜 업그레이드",
      closeOnClickOutside: true,
    });
    setModalOpen(true);
  };

  const handleDeleteSubscription = async () => {
    const confirmed = await showConfirm({
      title: "구독을 정말 취소하시겠어요?",
      text: `결제 수단이 즉시 삭제되며,\n지금부터 PREMIUM 혜택이 중단됩니다.`,
      confirmText: "구독 취소",
      cancelText: "취소",
      icon: "warning",
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await deleteSubscription();
      toast.success("구독이 정상적으로 취소되었어요.");
      // 상태 초기화 후 새로고침 또는 재조회 필요
      const info = await fetchSubscriptionInfo();
      const history = await fetchSubscriptionOrderHistory();
      setSubscription(info);
      setOrderHistory(history);
    } catch (error) {
      console.error("구독 취소 중 오류:", error);
      toast.error("구독 취소 중 문제가 발생했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6">
      {subscription?.planType ? (
        <>
          <PlanCard
            title="PREMIUM PLAN"
            price="월 19,900원"
            features={[
              "모든 BASIC 기능 포함",
              "멀티매장 관리",
              "알바생 추가 무제한",
            ]}
          />
          <button
            onClick={handleDeleteSubscription}
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-medium transition bg-white text-blue-500 border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "처리 중..." : "지금 구독 취소"}
          </button>
          <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
            <div className="text-sm text-gray-700 grid grid-cols-2 gap-y-1">
              <span className="text-gray-500">시작일</span>
              <span>{subscription?.startedAt ?? "-"}</span>
              <span className="text-gray-500">만료일</span>
              <span>{subscription?.expiredAt ?? "-"}</span>
              <span className="text-gray-500">다음 결제일</span>
              <span>{subscription?.nextPaymentDate ?? "-"}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <PlanCard
            title="BASIC PLAN"
            price="무료"
            features={["2개 매장 추가 가능", "알바생 추가 5인"]}
          />
          <button
            className="w-full py-3 rounded-lg font-medium transition bg-blue-500 text-white"
            onClick={handlePamentModalOpen}
          >
            프리미엄 플랜으로 업그레이드
          </button>
        </>
      )}

      {orderHistory.length > 0 && (
        <div className="w-full flex flex-col mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">결제 이력</h2>
          <ul className="space-y-4">
            {orderHistory.map((order) => {
              const isOpen = openMap[order.orderId] ?? false;

              return (
                <li
                  key={order.orderId}
                  className="bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <button
                    onClick={() => toggleOpen(order.orderId)}
                    className="flex items-center justify-between w-full px-5 py-4"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-gray-500">
                        결제일: {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-base font-medium text-gray-800">
                        금액: ₩{order.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          order.paymentStatus === "DONE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {order.paymentStatus === "DONE"
                          ? "결제 완료"
                          : "결제 실패"}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-4 text-sm text-gray-600 bg-gray-50 border-t">
                      {order.failReason && (
                        <div className="text-red-500 mb-1">
                          실패 사유: {order.failReason}
                        </div>
                      )}
                      <div>결제 ID: {order.orderId}</div>
                      <div>결제 플랜: {order.planType}</div>
                      <div>
                        전체 결제일시:{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscribePage;
