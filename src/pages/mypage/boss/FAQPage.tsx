import { useEffect, useState } from "react";
import { useUserStore } from "../../../stores/userStore.ts";
import { categoryLabelMap, FaqCategory, FaqItem } from "../../../types/faq.ts";
import { fetchFaqByRole } from "../../../api/common/faq.ts";
import { useLayout } from "../../../hooks/useLayout.ts";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button.tsx";

const categories: FaqCategory[] = ["ALL", "SERVICE", "PAYMENT", "ACCOUNT"];

const FAQPage = () => {
  const user = useUserStore((state) => state.user);
  const role = user?.role === "BOSS" ? "boss" : "staff";
  const navigate = useNavigate();

  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [category, setCategory] = useState<FaqCategory>("ALL");
  const [loading, setLoading] = useState(false);

  useLayout({
    title: "FAQ",
    theme: "plain",
    bottomNavVisible: false,
    onBack: () => {
      user?.role === "BOSS"
        ? navigate("/boss/store", { replace: true })
        : navigate("/staff/mypage", { replace: true });
    },
  });

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      try {
        const data = await fetchFaqByRole(role, category);
        setFaqList(data);
      } catch (error) {
        console.error("FAQ 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, [role, category]);

  return (
    <div className="flex flex-col w-full min-h-screen px-4 py-6 bg-white">
      {/* 카테고리 버튼 스크롤 영역 */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex w-fit gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-2.5 py-1 rounded-full body-2 whitespace-nowrap border transition-colors ${
                category === c
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {categoryLabelMap[c]}
            </button>
          ))}
        </div>
      </div>
      <Button size="sm" theme="outline" className="w-full mt-4">
        <a
          href={`mailto:mangobutter.ajou@gmail.com?subject=${encodeURIComponent(
            "MangoButter 서비스 문의",
          )}&body=${encodeURIComponent(
            `안녕하세요, MangoButter 팀에게 문의드립니다.\n\n[문의 유형]\n- 서비스 이용 관련\n- 결제 및 계정 문제\n- 기타\n\n[문의 내용]\n여기에 내용을 작성해주세요.\n\n감사합니다.`,
          )}`}
          className="text-sm"
        >
          문의하기
        </a>
      </Button>
      {/* FAQ 리스트 */}
      <div className="mt-6 flex-1">
        {loading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : faqList.length === 0 ? (
          <p className="text-center text-gray-400">FAQ가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {faqList.map((faq) => (
              <li
                key={faq.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <p className="font-semibold mb-2">Q. {faq.question}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  A. {faq.answer}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FAQPage;
