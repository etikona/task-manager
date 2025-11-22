"use client";

import { useAppSelector } from "@/hooks/redux";

interface CapacityIndicatorProps {
  memberId: number;
}

const CapacityIndicator = ({ memberId }: CapacityIndicatorProps) => {
  const { tasks } = useAppSelector((state) => state.tasks);
  const { members } = useAppSelector((state) => state.teams);

  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return null;
  }

  const memberTasksCount = tasks.filter(
    (task) => task.assignedMemberId === memberId
  ).length;

  const isOverCapacity = memberTasksCount > member.capacity;
  const isNearCapacity = memberTasksCount === member.capacity;

  return (
    <span
      className={`text-xs ml-2 ${
        isOverCapacity
          ? "text-red-600 font-semibold"
          : isNearCapacity
          ? "text-yellow-600"
          : "text-green-600"
      }`}
    >
      ({memberTasksCount}/{member.capacity}){isOverCapacity && " ⚠️ Overloaded"}
      {isNearCapacity && " ⚠️ Full"}
    </span>
  );
};

export default CapacityIndicator;
