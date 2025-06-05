import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskDetail } from "../../../../types/task.ts";
import { BossTaskAPI } from "../../../../api/boss/task.ts";
import useStoreStore from "../../../../stores/storeStore.ts";
import { toast } from "react-toastify";
import Button from "../../../../components/common/Button.tsx";
import Label from "../../../../components/common/Label.tsx";
import { formatTaskTime } from "../../../../utils/task.ts";
import { useLayout } from "../../../../hooks/useLayout.ts";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const [task, setTask] = useState<TaskDetail | null>(null);

  useLayout({
    title: "업무 상세",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate(-1),
    rightIcon: null,
  });

  const fetchTaskDetail = async () => {
    if (!storeId || !taskId) return;

    try {
      const data = await BossTaskAPI.getTaskDetail(storeId, Number(taskId));
      setTask(data);
    } catch (err) {
      console.error("업무 상세 조회 실패", err);
      toast.error("업무 정보를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchTaskDetail();
  }, [storeId, taskId]);

  const handleDelete = async () => {
    if (
      !storeId ||
      !taskId ||
      !window.confirm("정말로 이 업무를 삭제하시겠습니까?")
    )
      return;

    try {
      await BossTaskAPI.deleteTask(storeId, Number(taskId));
      toast.success("업무가 삭제되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("업무 삭제 실패", err);
      toast.error("업무 삭제에 실패했습니다.");
    }
  };

  if (!task) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="w-full p-5 flex flex-col h-full justify-between">
      <div className="w-full h-full flex justify-between items-start overflow-auto scrollbar-hide">
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Label size="lg" theme={task.taskLog ? "solid" : "ghost"}>
              {task.taskLog ? "완료" : "미완료"}
            </Label>
            {task.isPhotoRequired ? (
              <Label theme="lightsecond" size="lg">
                인증샷
              </Label>
            ) : (
              <Label theme="lightsolid" size="lg">
                체크
              </Label>
            )}
          </div>
          <div className="w-full flex flex-col gap-1 pb-4 border-b border-grayscale-200 dark:border-grayscale-700">
            <div className="flex gap-2 items-center">
              <span className="heading-3">{task.taskDate}</span>
              <span className="heading-3 text-grayscale-500">
                {formatTaskTime(task.startTime)} ~{" "}
                {formatTaskTime(task.endTime)}
              </span>
            </div>

            <span className="heading-2">{task.title}</span>
            {task.description && (
              <p className="text-grayscale-700 whitespace-pre-wrap">
                {task.description}
              </p>
            )}
            {task.referenceImageUrl && (
              <img
                src={task.referenceImageUrl}
                alt="참고 사진"
                className="w-full rounded-lg mt-2"
              />
            )}
          </div>
          {task.taskLog ? (
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="title-2 text-grayscale-900">작성자</h2>
                <div className="flex items-center gap-2">
                  <img
                    src={task.taskLog.checkedStaff.profileImageUrl}
                    alt={task.taskLog.checkedStaff.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="body-2">
                    {task.taskLog.checkedStaff.name}
                  </span>
                </div>
              </div>

              {task.taskLog.taskLogImageUrl && (
                <div className="flex flex-col gap-1">
                  <h2 className="title-2 text-grayscale-900">인증 사진</h2>
                  <img
                    src={task.taskLog.taskLogImageUrl}
                    alt="인증 사진"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>미완료</div>
          )}
        </div>
      </div>
      <div className="w-full mt-4 shrink-0">
        <Button
          size="sm"
          theme="danger"
          onClick={handleDelete}
          className="w-full"
        >
          업무 삭제
        </Button>
      </div>
    </div>
  );
};

export default TaskDetailPage;
