import { useFormContext } from "react-hook-form";
import TextField from "../../../../components/common/TextField.tsx";
import Button from "../../../../components/common/Button.tsx";

interface Props {
  onNext: () => void;
}

const MAX_TITLE_LENGTH = 32;

const TaskStep1 = ({ onNext }: Props) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const title = watch("title");
  const description = watch("description");

  const isValid = !!title?.trim() && !!description?.trim();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 업무 제목 */}
      <section>
        <TextField
          {...register("title")}
          title="업무 제목"
          required
          placeholder="업무 제목 (최대 32자)"
          maxLength={MAX_TITLE_LENGTH}
          state={errors.title ? "warning" : "none"}
          helperText={errors.title?.message as string}
        />
      </section>

      {/* 업무 설명 */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <label className="title-1 text-grayscale-900">업무 설명</label>
          <span className="text-warning text-lg">*</span>
        </div>
        <textarea
          {...register("description")}
          placeholder="설명 입력"
          className="w-full min-h-[100px] px-5 py-3 rounded-lg border border-grayscale-300 text-grayscale-900 placeholder:text-grayscale-500 focus:outline-none focus:border-grayscale-500 resize-none body-1"
        />
      </section>

      {/* 다음 버튼 */}
      <div className="mt-auto">
        <Button
          type="button"
          theme="primary"
          className="w-full"
          state={isValid ? "default" : "disabled"}
          onClick={onNext}
          disabled={!isValid}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default TaskStep1;
