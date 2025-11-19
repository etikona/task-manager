// app/tasks/create/page.tsx
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
} from "lucide-react";
import Link from "next/link";

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

  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { teams, members } = useAppSelector((state) => state.teams);
  const { loading } = useAppSelector((state) => state.tasks);
  const router = useRouter();

  // Update available members when project changes
  useEffect(() => {
    if (formData.projectId) {
      const project = projects.find(
        (p) => p.id === parseInt(formData.projectId)
      );
      if (project) {
        const teamMembers = members.filter((m) => m.teamId === project.teamId);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedProjectMembers(teamMembers);
      }
    } else {
      setSelectedProjectMembers([]);
    }
  }, [formData.projectId, projects, members]);

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

  const getMemberCapacityInfo = (memberId: string) => {
    const member = members.find((m) => m.id === parseInt(memberId));
    if (!member) return null;

    const memberTasks = selectedProjectMembers.filter(
      (m) => m.id === parseInt(memberId)
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

        {/* Form Card */}
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
            {/* Task Title */}
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

            {/* Project Selection */}
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

            {/* Assignee Selection */}
            <div>
              <label
                htmlFor="assignedMemberId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assign To
              </label>
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
                    return (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                        {capacityInfo &&
                          ` (${capacityInfo.currentTasks}/${capacityInfo.capacity} tasks)`}
                        {capacityInfo?.isOverloaded && " ⚠️"}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>
              {!formData.projectId && (
                <p className="mt-2 text-sm text-gray-500">
                  Select a project first to see available team members
                </p>
              )}
            </div>

            {/* Priority */}
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

            {/* Status */}
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

            {/* Description */}
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

            {/* Submit Button */}
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
