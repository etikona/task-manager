// components/MemberCapacityBadge.tsx
"use client";

import { useAppSelector } from "@/hooks/redux";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface MemberCapacityBadgeProps {
  memberId: number;
  showIcon?: boolean;
  compact?: boolean;
}

export default function MemberCapacityBadge({
  memberId,
  showIcon = true,
  compact = false,
}: MemberCapacityBadgeProps) {
  const { tasks } = useAppSelector((state) => state.tasks);
  const { members } = useAppSelector((state) => state.teams);

  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-300">
        {showIcon && <AlertTriangle className="w-3 h-3" />}
        Unknown
      </span>
    );
  }

  // Count tasks assigned to this member
  const memberTasksCount = tasks.filter(
    (task) => task.assignedMemberId === memberId
  ).length;

  const isOverCapacity = memberTasksCount > member.capacity;
  const isNearCapacity = memberTasksCount === member.capacity;
  const hasCapacity = memberTasksCount < member.capacity;

  // Determine styles based on capacity
  const getCapacityStyles = () => {
    if (isOverCapacity) {
      return "bg-red-100 text-red-800 border-red-300";
    } else if (isNearCapacity) {
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    } else {
      return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getCapacityIcon = () => {
    if (isOverCapacity) {
      return <AlertTriangle className="w-3 h-3" />;
    } else if (isNearCapacity) {
      return <AlertTriangle className="w-3 h-3" />;
    } else {
      return <CheckCircle2 className="w-3 h-3" />;
    }
  };

  const getCapacityText = () => {
    if (compact) {
      return `${memberTasksCount}/${member.capacity}`;
    }

    if (isOverCapacity) {
      return `${memberTasksCount}/${member.capacity} — Overloaded`;
    } else if (isNearCapacity) {
      return `${memberTasksCount}/${member.capacity} — At Capacity`;
    } else {
      return `${memberTasksCount}/${member.capacity} — Available`;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCapacityStyles()}`}
    >
      {showIcon && getCapacityIcon()}
      {getCapacityText()}
    </span>
  );
}
