"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { reassignTasks } from "@/store/slices/taskSlice";
import { selectRecentActivities } from "@/store/slices/activitySlice";
import {
  Users,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Activity,
  User,
  AlertTriangle,
  Target,
  BarChart3,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const Toast = ({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transform transition-all duration-300 ${
        type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const ActivityMonitor = () => {
  const activities = useAppSelector((state) =>
    selectRecentActivities(state, 5)
  );

  console.log("Dashboard - Current activities:", activities);

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 p-3 rounded-lg text-sm max-w-xs z-50">
      <div className="font-semibold text-blue-800 mb-2">Activity Monitor</div>
      <div className="text-blue-700 mb-2">Total: {activities?.length || 0}</div>
      <div className="text-blue-600 text-xs max-h-20 overflow-y-auto">
        {activities?.map((activity, index) => (
          <div key={index} className="truncate">
            {activity.action}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { projects } = useAppSelector((state) => state.projects);
  const { members } = useAppSelector((state) => state.teams);

  const recentActivities = useAppSelector((state) =>
    selectRecentActivities(state, 5)
  );

  const overloadedMembers = useAppSelector((state) =>
    state.tasks.tasks && state.teams.members
      ? state.teams.members.filter((member) => {
          const taskCount = state.tasks.tasks.filter(
            (task) => task.assignedMemberId === member.id
          ).length;
          return taskCount > member.capacity;
        })
      : []
  );

  const [isReassigning, setIsReassigning] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    console.log("Recent activities updated:", recentActivities);
  }, [recentActivities]);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === "done").length || 0;
  const pendingTasks = tasks?.filter((t) => t.status === "pending").length || 0;
  const inProgressTasks =
    tasks?.filter((t) => t.status === "in-progress").length || 0;

  const totalCapacity =
    members?.reduce((sum, member) => sum + member.capacity, 0) || 0;

  const totalAssignedTasks =
    tasks?.filter((task) => task.assignedMemberId !== null).length || 0;

  const utilization =
    totalCapacity > 0 ? (totalAssignedTasks / totalCapacity) * 100 : 0;

  const teamLoadSummary = {
    optimal:
      members?.filter((member) => {
        const taskCount =
          tasks?.filter((task) => task.assignedMemberId === member.id).length ||
          0;
        return taskCount <= member.capacity && taskCount > 0;
      }).length || 0,

    overloaded: overloadedMembers?.length || 0,

    available:
      members?.filter((member) => {
        const taskCount =
          tasks?.filter((task) => task.assignedMemberId === member.id).length ||
          0;
        return taskCount < member.capacity;
      }).length || 0,

    unassigned:
      tasks?.filter((task) => task.assignedMemberId === null).length || 0,
  };

  const handleReassignTasks = async () => {
    if (overloadedMembers.length === 0) {
      setToast({
        message: "No overloaded members found. Team workload is balanced!",
        type: "success",
      });
      return;
    }

    setIsReassigning(true);

    try {
      dispatch(reassignTasks({ members }));

      setTimeout(() => {
        setIsReassigning(false);
        setToast({
          message: `Successfully reassigned tasks! ${overloadedMembers.length} members balanced.`,
          type: "success",
        });
      }, 1500);
    } catch (error) {
      console.error("Reassignment failed:", error);
      setIsReassigning(false);
      setToast({
        message: "Failed to reassign tasks. Please try again.",
        type: "error",
      });
    }
  };

  const getTimeAgo = (timestamp: number) => {
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getActivityIcon = (action: string) => {
    if (action.includes("Task") && action.includes("created")) {
      return <ListTodo className="w-4 h-4 text-blue-500" />;
    } else if (action.includes("reassigned")) {
      return <RefreshCw className="w-4 h-4 text-green-500" />;
    } else if (action.includes("updated")) {
      return <Activity className="w-4 h-4 text-orange-500" />;
    } else if (action.includes("deleted")) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    } else if (action.includes("Project")) {
      return <FolderKanban className="w-4 h-4 text-purple-500" />;
    } else if (action.includes("Team")) {
      return <Users className="w-4 h-4 text-indigo-500" />;
    } else {
      return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of your projects, tasks, and team workload
            </p>
          </div>

          <div className="flex items-center gap-4">
            {overloadedMembers.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{overloadedMembers.length} members overloaded</span>
              </div>
            )}

            <button
              onClick={handleReassignTasks}
              disabled={isReassigning || overloadedMembers.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isReassigning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Reassigning Tasks...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Reassign Tasks</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {projects?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <ListTodo className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalTasks}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {completedTasks} done
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {inProgressTasks} in progress
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {teamLoadSummary.optimal}/{members?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Optimal Load</div>
                <div className="flex gap-1 mt-1">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {teamLoadSummary.overloaded} overloaded
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {teamLoadSummary.unassigned} unassigned
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {utilization.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Capacity Used</div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalAssignedTasks}/{totalCapacity} tasks
                </div>
              </div>
            </div>

            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  utilization > 90
                    ? "bg-red-600"
                    : utilization > 75
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(utilization, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <Link
                href="/activity"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
                <Plus className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">
                        {activity.action}
                      </p>
                      {activity.details && (
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.details}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {getTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-600">No recent activity</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Activities will appear here as you work
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Team Workload
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                {members?.length || 0} members
              </span>
            </div>

            <div className="space-y-4">
              {members?.map((member) => {
                const memberTasks =
                  tasks?.filter((task) => task.assignedMemberId === member.id)
                    .length || 0;
                const isOverloaded = memberTasks > member.capacity;
                const isAtCapacity = memberTasks === member.capacity;
                const availableCapacity = Math.max(
                  0,
                  member.capacity - memberTasks
                );

                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                      isOverloaded
                        ? "bg-red-50 border-red-200"
                        : isAtCapacity
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {member.role}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-semibold text-lg ${
                          isOverloaded
                            ? "text-red-700"
                            : isAtCapacity
                            ? "text-yellow-700"
                            : "text-gray-700"
                        }`}
                      >
                        {memberTasks}/{member.capacity}
                      </div>
                      <div className="text-xs text-gray-500">
                        {availableCapacity > 0
                          ? `${availableCapacity} available`
                          : "No capacity"}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Unassigned Tasks
                      </div>
                      <div className="text-sm text-gray-600">
                        Waiting for assignment
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg text-gray-700">
                      {teamLoadSummary.unassigned}
                    </div>
                    <div className="text-xs text-gray-500">tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ActivityMonitor />
    </div>
  );
}
