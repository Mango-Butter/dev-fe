import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskDetail } from "../../../types/task";
import { BossTaskAPI } from "../../../api/boss/task";
import useStoreStore from "../../../stores/storeStore";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import Label from "../../../components/common/Label";
import { formatTaskTime } from "../../../utils/task";
import { useLayout } from "../../../hooks/useLayout";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const [task, setTask] = useState<TaskDetail | null>(null);

  useLayout({
    title: task?.title || "업무 상세",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate(-1),
    rightIcon: null,
  });

  const fetchTaskDetail = async () => {
    if (!storeId || !taskId) return;

    try {
      const data = await BossTaskAPI.getTaskDetail(
        String(storeId),
        Number(taskId),
      );
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
      await BossTaskAPI.deleteTask(String(storeId), Number(taskId));
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
    <div className="p-5 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Label size="lg" theme={task.taskLog ? "ghost" : "solid"}>
              {task.taskLog ? "완료" : "진행"}
            </Label>
            <Label theme="ghost" size="lg" className="text-grayscale-500">
              {task.isPhotoRequired ? "인증샷" : "체크"}
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <span className="body-1 text-grayscale-600">업무 수행 시간</span>
            <span className="title-1 text-grayscale-600">
              {formatTaskTime(task.startTime)} - {formatTaskTime(task.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="body-1 text-grayscale-600">작성자 : </span>
            <span className="title-1 text-grayscale-600">
              {task.taskLog?.checkedStaff.name}
            </span>
          </div>
          {task.referenceImageUrl && (
            <div>
              <h2 className="title-1 text-grayscale-900 mb-2">참고 사진</h2>
              <img
                src={task.referenceImageUrl}
                alt="참고 사진"
                className="w-full rounded-lg"
              />
            </div>
          )}
          {task.description && (
            <div>
              <h2 className="title-1 text-grayscale-900 mb-2">업무 설명</h2>
              <p className="text-grayscale-700 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}
          {task.taskLog && (
            <div>
              {task.taskLog?.taskLogImageUrl && (
                <div>
                  <h2 className="title-1 text-grayscale-900 mb-2">인증 사진</h2>
                  <img
                    src={task.taskLog.taskLogImageUrl}
                    alt="인증 사진"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Button size="sm" theme="outline" onClick={handleDelete}>
        업무 삭제
      </Button>
    </div>
  );
};

export default TaskDetailPage;
