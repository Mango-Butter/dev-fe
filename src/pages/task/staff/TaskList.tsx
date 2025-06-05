import { StaffTask } from "../../../types/task";

interface TaskListProps {
  tasks: StaffTask[];
  onTaskClick: (taskId: number) => void;
  isLoading: boolean;
}

const TaskList = ({ tasks, onTaskClick, isLoading }: TaskListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        등록된 업무가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.taskId}
          className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onTaskClick(task.taskId)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{task.title}</h3>
            <span className="text-sm text-gray-500">
              {task.startTime.slice(0, 5)} ~ {task.endTime.slice(0, 5)}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {task.isPhotoRequired ? "사진 인증" : "체크 인증"}
              </span>
              {task.referenceImageUrl && (
                <span className="text-xs text-blue-500">참고 사진 있음</span>
              )}
            </div>

            <div className="flex items-center">
              {task.taskLog ?
                <span className="text-sm text-green-500">완료됨</span>
              : <span className="text-sm text-yellow-500">진행 중</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
