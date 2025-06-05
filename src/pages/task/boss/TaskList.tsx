import React from "react";
import { TaskStatus } from "../../../types/task";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: TaskStatus[];
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center text-grayscale-500 py-8">
        등록된 업무가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.taskId} {...task} />
      ))}
    </div>
  );
};

export default TaskList;
