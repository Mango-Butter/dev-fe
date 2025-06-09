import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import modalStore from "../../../../stores/modalStore.ts";
import useStaffStoreStore from "../../../../stores/useStaffStoreStore.ts";
import { isValidStoreId } from "../../../../utils/store.ts";
import {
  createWorkReport,
  getWorkReportImageUploadUrl,
  uploadImageToPresignedUrl,
} from "../../../../api/staff/report.ts";
import FileDropzone from "../../../../components/common/FileDropzone.tsx";
import Button from "../../../../components/common/Button.tsx";
import {
  RadioOff,
  RadioSecondary,
} from "../../../../components/icons/RadioIcon.tsx";

interface ReportAddModalContentProps {
  fetchReports?: () => void;
}

const schema = z.object({
  content: z.string().min(1, "내용을 입력해주세요."),
  reportImageUrl: z.string().url().nullable(),
  targetType: z.enum(["TO_BOSS", "TO_STAFF"], {
    errorMap: () => ({ message: "대상을 선택해주세요." }),
  }),
});

type FormValues = z.infer<typeof schema>;

const ReportAddModalContent: React.FC<ReportAddModalContentProps> = ({
  fetchReports,
}) => {
  const { setModalOpen } = modalStore();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      content: "",
      reportImageUrl: null,
      targetType: "TO_STAFF",
    },
  });

  const handleUpload = async (file: File | null) => {
    if (!file) {
      setPreviewFile(null);
      setValue("reportImageUrl", null);
      return;
    }

    if (!isValidStoreId(storeId)) {
      toast.error("매장 정보가 올바르지 않습니다.");
      return;
    }

    try {
      setIsUploading(true);
      const extension = file.name.split(".").pop()!;
      const contentType = file.type;

      const { uploadUrl, publicUrl } = await getWorkReportImageUploadUrl(
        storeId,
        extension,
        contentType,
      );

      await uploadImageToPresignedUrl(uploadUrl, file);

      setPreviewFile(file);
      setValue("reportImageUrl", publicUrl, { shouldValidate: true });
      toast.success("이미지가 업로드되었습니다.");
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!isValidStoreId(storeId)) return;

    try {
      setIsSubmitting(true);
      await createWorkReport(storeId, data);
      toast.success("보고사항이 등록되었습니다.");
      fetchReports?.();
      setModalOpen(false);
    } catch {
      toast.error("보고사항 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* 보고 내용 */}
      <section className="flex flex-col gap-2">
        <label className="title-1 text-grayscale-900">보고 내용</label>
        <textarea
          {...register("content")}
          placeholder="설명 입력"
          className="w-full min-h-[100px] px-5 py-3 rounded-lg border border-grayscale-300 text-grayscale-900 placeholder:text-grayscale-500 focus:outline-none focus:border-grayscale-500 resize-none body-1"
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
      </section>

      {/* 이미지 업로드 */}
      <Controller
        control={control}
        name="reportImageUrl"
        render={() => (
          <FileDropzone
            file={previewFile}
            onChange={handleUpload}
            placeholder={
              isUploading ? "업로드 중..." : "보고 사진을 업로드하세요 (선택)"
            }
          />
        )}
      />

      {/* 대상 선택 */}
      <Controller
        control={control}
        name="targetType"
        render={({ field }) => (
          <section className="flex flex-col gap-2">
            <label className="title-1 text-grayscale-900">전달 대상</label>
            <div className="flex gap-4">
              {[
                { label: "모두에게", value: "TO_STAFF" },
                { label: "사장님께만", value: "TO_BOSS" },
              ].map((option) => {
                const isSelected = field.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() => field.onChange(option.value)}
                  >
                    {isSelected ? (
                      <RadioSecondary className="w-5 h-5" />
                    ) : (
                      <RadioOff className="w-5 h-5" />
                    )}
                    <span className="body-2 text-grayscale-800">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.targetType && (
              <p className="text-xs text-red-500">
                {errors.targetType.message}
              </p>
            )}
          </section>
        )}
      />

      {/* 제출 버튼 */}
      <Button
        type="submit"
        theme="secondary"
        disabled={!isValid || isSubmitting}
        state={!isValid || isSubmitting ? "disabled" : "default"}
      >
        {isSubmitting ? "등록 중..." : "작성 완료"}
      </Button>
    </form>
  );
};

export default ReportAddModalContent;
