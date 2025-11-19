"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createTask } from "@/store/slices/taskSlice";
import {
  ArrowLeft,
  Save,
  ListTodo,
  User,
  FolderKanban,
  Flag,
  AlertTriangle,
  Zap,
  Users,
} from "lucide-react";
import Link from "next/link";
import { findBestMember, getAvailableMembers } from "@/utils/autoAssign";

export default function CreateTaskPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedMemberId: "",
    priority: "medium",
    status: "pending",
  });
  const [errors, setErrors] = useState<{ title?: string; projectId?: string }>(
    {}
  );
  const [selectedProjectMembers, setSelectedProjectMembers] = useState<any[]>(
    []
  );
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);

  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { teams, members } = useAppSelector((state) => state.teams);
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const router = useRouter();

  useEffect(() => {
    if (formData.projectId) {
      const project = projects.find(
        (p) => p.id === parseInt(formData.projectId)
      );
      if (project) {
        const teamMembers = members.filter((m) => m.teamId === project.teamId);
        setSelectedProjectMembers(teamMembers);

        const membersWithLoad = getAvailableMembers(teamMembers, tasks);
        setAvailableMembers(membersWithLoad);
      }
    } else {
      setSelectedProjectMembers([]);
      setAvailableMembers([]);
    }
  }, [formData.projectId, projects, members, tasks]);

  const validateForm = () => {
    const newErrors: { title?: string; projectId?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(
      createTask({
        title: formData.title,
        description: formData.description,
        projectId: parseInt(formData.projectId),
        assignedMemberId: formData.assignedMemberId
          ? parseInt(formData.assignedMemberId)
          : null,
        priority: formData.priority as any,
        status: formData.status as any,
      })
    );

    router.push("/tasks");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleAutoAssign = () => {
    if (!formData.projectId) {
      alert("Please select a project first");
      return;
    }

    setIsAutoAssigning(true);

    setTimeout(() => {
      const project = projects.find(
        (p) => p.id === parseInt(formData.projectId)
      );
      if (project) {
        const teamMembers = members.filter((m) => m.teamId === project.teamId);
        const bestMember = findBestMember(teamMembers, tasks);

        if (bestMember) {
          setFormData((prev) => ({
            ...prev,
            assignedMemberId: bestMember.id.toString(),
          }));

          const memberInfo = availableMembers.find(
            (m) => m.member.id === bestMember.id
          );
          if (memberInfo) {
            console.log(
              `Auto-assigned to ${bestMember.name} (${memberInfo.currentTasks}/${bestMember.capacity} tasks)`
            );
          }
        } else {
          alert("No available team members found for auto-assignment");
        }
      }
      setIsAutoAssigning(false);
    }, 500);
  };

  const getMemberCapacityInfo = (memberId: string) => {
    const member = members.find((m) => m.id === parseInt(memberId));
    if (!member) return null;

    const memberTasks = tasks.filter(
      (t) => t.assignedMemberId === parseInt(memberId)
    ).length;
    const isOverloaded = memberTasks > member.capacity;

    return {
      currentTasks: memberTasks,
      capacity: member.capacity,
      isOverloaded,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/tasks"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tasks
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <ListTodo className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Task
              </h1>
              <p className="text-gray-600">Add a new task to your project</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FolderKanban className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none ${
                    errors.projectId
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>
              {errors.projectId && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.projectId}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="assignedMemberId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Assign To
                </label>

                <button
                  type="button"
                  onClick={handleAutoAssign}
                  disabled={!formData.projectId || isAutoAssigning}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
                >
                  {isAutoAssigning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      <span>Finding Best Member...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      <span>Auto Assign</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    id="assignedMemberId"
                    name="assignedMemberId"
                    value={formData.assignedMemberId}
                    onChange={handleChange}
                    disabled={!formData.projectId}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Unassigned</option>
                    {selectedProjectMembers.map((member) => {
                      const capacityInfo = getMemberCapacityInfo(
                        member.id.toString()
                      );
                      const isSelected =
                        formData.assignedMemberId === member.id.toString();

                      return (
                        <option
                          key={member.id}
                          value={member.id}
                          className={
                            capacityInfo?.isOverloaded
                              ? "text-red-600 font-semibold"
                              : isSelected
                              ? "text-green-600 font-semibold"
                              : ""
                          }
                        >
                          {member.name} - {member.role}
                          {capacityInfo &&
                            ` (${capacityInfo.currentTasks}/${capacityInfo.capacity} tasks)`}
                          {capacityInfo?.isOverloaded && " ⚠️ Overloaded"}
                          {isSelected && " ✅"}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                  </div>
                </div>

                {formData.projectId && availableMembers.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-medium text-gray-700">
                        Team Capacity Overview
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {availableMembers.map(
                        ({
                          member,
                          currentTasks,
                          availableCapacity,
                          loadPercentage,
                        }) => (
                          <div
                            key={member.id}
                            className={`flex items-center justify-between text-sm p-2 rounded ${
                              formData.assignedMemberId === member.id.toString()
                                ? "bg-green-50 border border-green-200"
                                : "bg-white border border-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-gray-500 text-xs">
                                ({member.role})
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  currentTasks > member.capacity
                                    ? "bg-red-100 text-red-700"
                                    : currentTasks === member.capacity
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {currentTasks}/{member.capacity} tasks
                              </span>

                              {availableCapacity > 0 && (
                                <span className="text-xs text-blue-600">
                                  +{availableCapacity} available
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!formData.projectId && (
                <p className="mt-2 text-sm text-gray-500">
                  Select a project first to see available team members
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priority
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Flag className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 hover:border-gray-400"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 hover:border-gray-400"
                placeholder="Describe the task requirements, objectives, and any specific instructions..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/tasks"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
