"use client";

import { useAppSelector } from "@/hooks/redux";
import { selectAllActivities } from "@/store/slices/activitySlice";
import {
  Activity,
  Calendar,
  Filter,
  ListTodo,
  RefreshCw,
  Users,
  AlertCircle,
  Trash2,
  Flag,
  ArrowUpDown,
  FolderKanban,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

const ActivityPage = () => {
  const allActivities = useAppSelector(selectAllActivities);
  const [filter, setFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  console.log("Activity Page - All activities:", allActivities);

  const filteredActivities = allActivities.filter((activity) => {
    if (filter === "all") return true;

    const action = activity.action.toLowerCase();
    switch (filter) {
      case "task":
        return action.includes("task");
      case "project":
        return action.includes("project");
      case "team":
        return action.includes("team");
      case "member":
        return action.includes("member");
      case "created":
        return action.includes("created");
      case "updated":
        return action.includes("updated");
      case "deleted":
        return action.includes("deleted");
      case "reassigned":
        return action.includes("reassigned");
      default:
        return true;
    }
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.timestamp - a.timestamp;
    } else {
      return a.timestamp - b.timestamp;
    }
  });

  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes("task") && actionLower.includes("created")) {
      return <ListTodo className="w-5 h-5 text-blue-600" />;
    } else if (
      actionLower.includes("task") &&
      actionLower.includes("reassigned")
    ) {
      return <RefreshCw className="w-5 h-5 text-green-600" />;
    } else if (
      actionLower.includes("task") &&
      actionLower.includes("updated")
    ) {
      return <Activity className="w-5 h-5 text-orange-600" />;
    } else if (
      actionLower.includes("task") &&
      actionLower.includes("deleted")
    ) {
      return <Trash2 className="w-5 h-5 text-red-600" />;
    } else if (actionLower.includes("project")) {
      return <FolderKanban className="w-5 h-5 text-purple-600" />;
    } else if (actionLower.includes("team")) {
      return <Users className="w-5 h-5 text-indigo-600" />;
    } else if (actionLower.includes("member")) {
      return <UserPlus className="w-5 h-5 text-teal-600" />;
    } else {
      return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes("task") && actionLower.includes("created")) {
      return "border-l-blue-500 bg-blue-50";
    } else if (
      actionLower.includes("task") &&
      actionLower.includes("reassigned")
    ) {
      return "border-l-green-500 bg-green-50";
    } else if (
      actionLower.includes("task") &&
      actionLower.includes("updated")
    ) {
      return "border-l-orange-500 bg-orange-50";
    } else if (
      actionLower.includes("task") &&
      actionLower.includes("deleted")
    ) {
      return "border-l-red-500 bg-red-50";
    } else if (actionLower.includes("project")) {
      return "border-l-purple-500 bg-purple-50";
    } else if (actionLower.includes("team")) {
      return "border-l-indigo-500 bg-indigo-50";
    } else if (actionLower.includes("member")) {
      return "border-l-teal-500 bg-teal-50";
    } else {
      return "border-l-gray-500 bg-gray-50";
    }
  };

  const getActivityType = (action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes("task")) {
      if (actionLower.includes("created")) return "Task Created";
      if (actionLower.includes("reassigned")) return "Task Reassigned";
      if (actionLower.includes("updated")) return "Task Updated";
      if (actionLower.includes("deleted")) return "Task Deleted";
      return "Task Activity";
    } else if (actionLower.includes("project")) {
      return "Project Activity";
    } else if (actionLower.includes("team")) {
      return "Team Activity";
    } else if (actionLower.includes("member")) {
      return "Member Activity";
    } else {
      return "Activity";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const groupedActivities = sortedActivities.reduce((groups, activity) => {
    const date = formatDate(activity.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof sortedActivities>);

  const activityFilters = [
    { value: "all", label: "All Activities", count: allActivities.length },
    {
      value: "task",
      label: "Task Activities",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("task")
      ).length,
    },
    {
      value: "project",
      label: "Project Activities",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("project")
      ).length,
    },
    {
      value: "team",
      label: "Team Activities",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("team")
      ).length,
    },
    {
      value: "member",
      label: "Member Activities",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("member")
      ).length,
    },
    {
      value: "created",
      label: "Created Items",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("created")
      ).length,
    },
    {
      value: "updated",
      label: "Updated Items",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("updated")
      ).length,
    },
    {
      value: "deleted",
      label: "Deleted Items",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("deleted")
      ).length,
    },
    {
      value: "reassigned",
      label: "Reassignments",
      count: allActivities.filter((a) =>
        a.action.toLowerCase().includes("reassigned")
      ).length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
              <p className="text-gray-600 mt-2">
                Track all activities and changes across your projects and teams
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
            }
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>
              Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Activities
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {activityFilters.map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  filter === filterOption.value
                    ? "bg-blue-100 border-blue-300 text-blue-700 font-semibold"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{filterOption.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    filter === filterOption.value
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {filterOption.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {Object.keys(groupedActivities).length > 0 ? (
            Object.entries(groupedActivities).map(([date, activities]) => (
              <div
                key={date}
                className="border-b border-gray-200 last:border-b-0"
              >
                {/* Date Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{date}</h3>
                    <span className="text-sm text-gray-500 ml-2">
                      {activities.length}{" "}
                      {activities.length === 1 ? "activity" : "activities"}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-6 border-l-4 hover:bg-gray-50 transition-colors duration-200 ${getActivityColor(
                        activity.action
                      )}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="shrink-0 mt-1">
                          {getActivityIcon(activity.action)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {getActivityType(activity.action)}
                            </span>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                              {formatTime(activity.timestamp)}
                            </span>
                          </div>

                          <p className="text-gray-700 mb-1 font-medium">
                            {activity.action}
                          </p>

                          {activity.details && (
                            <p className="text-gray-600 text-sm mb-2">
                              {activity.details}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            {activity.taskId && activity.taskId !== 0 && (
                              <div className="flex items-center gap-1">
                                <span>Task ID:</span>
                                <span className="font-medium">
                                  {activity.taskId}
                                </span>
                              </div>
                            )}
                            {activity.projectId && (
                              <div className="flex items-center gap-1">
                                <span>Project ID:</span>
                                <span className="font-medium">
                                  {activity.projectId}
                                </span>
                              </div>
                            )}
                            {activity.teamId && activity.teamId !== 0 && (
                              <div className="flex items-center gap-1">
                                <span>Team ID:</span>
                                <span className="font-medium">
                                  {activity.teamId}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {allActivities.length === 0
                  ? "No activities yet"
                  : "No activities match your filter"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {allActivities.length === 0
                  ? "Activities will appear here as you create, update, and manage tasks across your projects."
                  : "Try changing your filter to see more activities."}
              </p>
            </div>
          )}
        </div>

        {allActivities.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Showing {sortedActivities.length} of {allActivities.length}{" "}
              activities
              {filter !== "all" &&
                ` filtered by ${activityFilters
                  .find((f) => f.value === filter)
                  ?.label?.toLowerCase()}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
