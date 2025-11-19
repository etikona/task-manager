"use client";

import { useAppSelector } from "@/hooks/redux";
import { AlertTriangle, CheckCircle2, Users } from "lucide-react";
import MemberCapacityBadge from "./MemberCapacityBadge";

interface TeamCapacityOverviewProps {
  teamId: number;
  compact?: boolean;
}

export default function TeamCapacityOverview({
  teamId,
  compact = false,
}: TeamCapacityOverviewProps) {
  const { members } = useAppSelector((state) => state.teams);
  const { tasks } = useAppSelector((state) => state.tasks);

  const teamMembers = members.filter((m) => m.teamId === teamId);

  if (teamMembers.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <Users className="w-8 h-8 mx-auto mb-2" />
        <p>No team members found</p>
      </div>
    );
  }

  const totalCapacity = teamMembers.reduce(
    (sum, member) => sum + member.capacity,
    0
  );
  const totalAssignedTasks = teamMembers.reduce((sum, member) => {
    return (
      sum + tasks.filter((task) => task.assignedMemberId === member.id).length
    );
  }, 0);

  const overloadedMembers = teamMembers.filter((member) => {
    const taskCount = tasks.filter(
      (task) => task.assignedMemberId === member.id
    ).length;
    return taskCount > member.capacity;
  });

  if (compact) {
    return (
      <div className="space-y-2">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <span className="text-sm font-medium">{member.name}</span>
            <MemberCapacityBadge memberId={member.id} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Team Capacity</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {totalAssignedTasks}
          </div>
          <div className="text-sm text-gray-600">Assigned Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {totalCapacity}
          </div>
          <div className="text-sm text-gray-600">Total Capacity</div>
        </div>
      </div>

      {overloadedMembers.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">Capacity Warnings</span>
          </div>
          <p className="text-sm text-red-700">
            {overloadedMembers.length} member(s) are overloaded and need task
            reassignment.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {teamMembers.map((member) => {
          const taskCount = tasks.filter(
            (task) => task.assignedMemberId === member.id
          ).length;
          const isOverloaded = taskCount > member.capacity;

          return (
            <div
              key={member.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isOverloaded
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.role}</div>
                </div>
              </div>

              <MemberCapacityBadge memberId={member.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
