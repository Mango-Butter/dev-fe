import { useEffect, useState, useCallback } from "react";
import {
  fetchFAQsByCategory,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../../../api/admin/admin";
import { FAQItem, FAQCategory, FAQItemInput } from "../../../types/admin";
import Button from "../../../components/common/Button";
import TextField from "../../../components/common/TextField";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Modal from "../../../components/common/Modal";
import modalStore from "../../../stores/modalStore";

const categories: { label: string; value: FAQCategory }[] = [
  { label: "전체", value: "ALL" },
  { label: "서비스 이용", value: "SERVICE" },
  { label: "결제", value: "PAYMENT" },
  { label: "계정", value: "ACCOUNT" },
] as const;

const AdminFAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("ALL");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadFAQs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchFAQsByCategory(selectedCategory);
      setFaqs(data);
    } catch (error) {
      console.error("FAQ 불러오기 실패:", error);
      alert("FAQ를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadFAQs();
  }, [loadFAQs]);

  const toggleOpen = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const openEditDialog = useCallback(
    (faq: FAQItem | null) => {
      const ModalContent = () => {
        const [modalForm, setModalForm] = useState<FAQItemInput>({
          category: (faq?.category as Exclude<FAQCategory, "ALL">) || "SERVICE",
          question: faq?.question || "",
          answer: faq?.answer || "",
        });

        const handleCategoryChange = (
          e: React.ChangeEvent<HTMLSelectElement>
        ) => {
          setModalForm((prev) => ({
            ...prev,
            category: e.target.value as Exclude<FAQCategory, "ALL">,
          }));
        };

        const handleQuestionChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          setModalForm((prev) => ({ ...prev, question: e.target.value }));
        };

        const handleAnswerChange = (
          e: React.ChangeEvent<HTMLTextAreaElement>
        ) => {
          setModalForm((prev) => ({ ...prev, answer: e.target.value }));
        };

        const handleSubmit = async () => {
          try {
            if (!modalForm.question.trim() || !modalForm.answer.trim()) {
              alert("질문과 답변을 모두 입력해주세요.");
              return;
            }

            if (faq) {
              await updateFAQ(faq.id, modalForm);
            } else {
              await createFAQ(modalForm);
            }

            modalStore.getState().setModalOpen(false);
            loadFAQs();
          } catch (error) {
            console.error("FAQ 저장 실패:", error);
            alert("FAQ 저장에 실패했습니다.");
          }
        };

        return (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">
              {faq ? "FAQ 수정하기" : "FAQ 등록하기"}
            </h2>
            <div className="flex flex-col gap-2">
              <label className="title-1 text-grayscale-900">카테고리</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={modalForm.category}
                onChange={handleCategoryChange}
              >
                {categories
                  .filter((cat) => cat.value !== "ALL")
                  .map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
              </select>
            </div>
            <TextField
              title="질문"
              placeholder="질문을 입력하세요"
              value={modalForm.question}
              onChange={handleQuestionChange}
            />
            <div className="flex flex-col gap-2">
              <label className="title-1 text-grayscale-900">답변</label>
              <textarea
                className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:border-primary-600"
                placeholder="답변을 입력하세요"
                value={modalForm.answer}
                onChange={handleAnswerChange}
              />
            </div>
            <Button
              theme="primary"
              size="md"
              className="w-full mt-2"
              onClick={handleSubmit}
            >
              {faq ? "수정 완료" : "등록 완료"}
            </Button>
          </div>
        );
      };

      modalStore.getState().setModalContent(<ModalContent />, {
        title: faq ? "FAQ 수정하기" : "FAQ 등록하기",
        closeOnClickOutside: false,
      });
      modalStore.getState().setModalOpen(true);
    },
    [loadFAQs]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("정말로 이 FAQ를 삭제하시겠습니까?")) {
        return;
      }

      try {
        await deleteFAQ(id);
        loadFAQs();
      } catch (error) {
        console.error("FAQ 삭제 실패:", error);
        alert("FAQ 삭제에 실패했습니다.");
      }
    },
    [loadFAQs]
  );

  return (
    <div className="flex flex-col gap-8 px-12 py-12 w-full h-full rounded-3xl bg-white ">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">망고버터의 FAQ를 등록하세요</h2>
        <Button theme="primary" size="md" onClick={() => openEditDialog(null)}>
          등록하기
        </Button>
      </div>

      <div className="flex gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            theme={selectedCategory === cat.value ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {isLoading ?
        <div className="flex justify-center items-center h-32">
          <p>로딩 중...</p>
        </div>
      : <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border rounded-md">
              <button
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted"
                onClick={() => toggleOpen(index)}
              >
                <div>
                  <div className="text-sm text-muted-foreground">
                    {categories.find((cat) => cat.value === faq.category)
                      ?.label || faq.category}
                  </div>
                  <div className="font-medium">{faq.question}</div>
                </div>
                {openIndex === index ?
                  <ChevronUpIcon className="w-5 h-5" />
                : <ChevronDownIcon className="w-5 h-5" />}
              </button>
              {openIndex === index && (
                <div className="bg-gray-100 px-4 py-3 text-sm text-gray-700 flex justify-between items-center">
                  <p>{faq.answer}</p>
                  <div className="flex gap-2">
                    <Button
                      theme="outline"
                      size="sm"
                      onClick={() => openEditDialog(faq)}
                    >
                      수정
                    </Button>
                    <Button
                      theme="outline"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      }

      <Modal />
    </div>
  );
};

export default AdminFAQ;
