// app/tasks/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  Plus,
  ListTodo,
  Search,
  Filter,
  User,
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
  Edit,
  Trash2,
} from "lucide-react";

import { deleteTask } from "@/store/slices/taskSlice";
import { useRouter } from "next/navigation";
import MemberCapacityBadge from "../Components/MemberCapacityBadge";

export default function TasksPage() {
  const { tasks } = useAppSelector((state) => state.tasks);
  const { projects } = useAppSelector((state) => state.projects);
  const { members } = useAppSelector((state) => state.teams);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleEditTask = (taskId: number) => {
    router.push(`/tasks/edit/${taskId}`);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  // Filter tasks based on all criteria
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject =
      projectFilter === "all" || task.projectId.toString() === projectFilter;
    const matchesMember =
      memberFilter === "all" ||
      (task.assignedMemberId &&
        task.assignedMemberId.toString() === memberFilter) ||
      (memberFilter === "unassigned" && task.assignedMemberId === null);
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesProject &&
      matchesMember &&
      matchesStatus &&
      matchesPriority
    );
  });

  // Helper functions
  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const getMemberName = (memberId: number | null) => {
    if (!memberId) return "Unassigned";
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown Member";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Flag className="w-3 h-3 fill-red-500 text-red-500" />;
      case "medium":
        return <Flag className="w-3 h-3 fill-yellow-500 text-yellow-500" />;
      case "low":
        return <Flag className="w-3 h-3 fill-blue-500 text-blue-500" />;
      default:
        return <Flag className="w-3 h-3 fill-gray-500 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-green-700 bg-green-50 border-green-200";
      case "in-progress":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "pending":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  // Calculate capacity statistics
  const getCapacityStats = () => {
    const totalCapacity = members.reduce(
      (sum, member) => sum + member.capacity,
      0
    );
    const totalAssignedTasks = tasks.filter(
      (task) => task.assignedMemberId !== null
    ).length;
    const overloadedMembers = members.filter((member) => {
      const taskCount = tasks.filter(
        (task) => task.assignedMemberId === member.id
      ).length;
      return taskCount > member.capacity;
    });

    return {
      totalCapacity,
      totalAssignedTasks,
      overloadedMembers: overloadedMembers.length,
      utilization:
        totalCapacity > 0 ? (totalAssignedTasks / totalCapacity) * 100 : 0,
    };
  };

  const capacityStats = getCapacityStats();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-2">
              Manage and track all tasks across projects
            </p>
          </div>
          <Link
            href="/tasks/create"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl w-fit"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </Link>
        </div>

        {/* Capacity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">
              {tasks.length}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {capacityStats.totalAssignedTasks}
            </div>
            <div className="text-sm text-gray-600">Assigned Tasks</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">
              {capacityStats.totalCapacity}
            </div>
            <div className="text-sm text-gray-600">Total Capacity</div>
          </div>
          <div
            className={`rounded-2xl shadow-sm border p-4 ${
              capacityStats.overloadedMembers > 0
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                capacityStats.overloadedMembers > 0
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              {capacityStats.overloadedMembers}
            </div>
            <div className="text-sm text-gray-600">Overloaded Members</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400"
                  />
                </div>
              </div>

              {/* Toggle Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <Filter className="w-5 h-5" />
                Filters
                {(projectFilter !== "all" ||
                  memberFilter !== "all" ||
                  statusFilter !== "all" ||
                  priorityFilter !== "all") && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {/* Project Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="all">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Member Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  <select
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="all">All Members</option>
                    <option value="unassigned">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0
                ? "Create your first task to get started"
                : "Try adjusting your search or filters"}
            </p>
            {tasks.length === 0 && (
              <Link
                href="/tasks/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(task.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Task Title and Priority */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {task.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {getPriorityIcon(task.priority)}
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FolderKanban className="w-4 h-4" />
                            <span>{getProjectName(task.projectId)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{getMemberName(task.assignedMemberId)}</span>
                            {task.assignedMemberId && (
                              <MemberCapacityBadge
                                memberId={task.assignedMemberId}
                                showIcon={false}
                                compact={true}
                              />
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status === "in-progress"
                              ? "In Progress"
                              : task.status.charAt(0).toUpperCase() +
                                task.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => handleEditTask(task.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {tasks.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter((t) => t.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "in-progress").length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "done").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
