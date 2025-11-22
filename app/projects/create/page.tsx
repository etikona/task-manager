"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createProject } from "@/store/slices/projectSlice";
import { ArrowLeft, Save, FolderKanban, Users } from "lucide-react";
import Link from "next/link";

const CreateProjectPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: "",
    status: "active",
  });
  const [errors, setErrors] = useState<{ name?: string; teamId?: string }>({});

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { teams } = useAppSelector((state) => state.teams);
  const { loading } = useAppSelector((state) => state.projects);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { name?: string; teamId?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.teamId) {
      newErrors.teamId = "Please select a team";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) return;

    dispatch(
      createProject({
        name: formData.name,
        description: formData.description,
        teamId: parseInt(formData.teamId),
        createdById: user.id,
        status: formData.status,
      })
    );

    router.push("/projects");
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Project
              </h1>
              <p className="text-gray-600">
                Set up a new project and assign it to a team
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="teamId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assign to Team *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="teamId"
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none ${
                    errors.teamId
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>
              {errors.teamId && (
                <p className="mt-2 text-sm text-red-600">{errors.teamId}</p>
              )}
              {teams.length === 0 && (
                <p className="mt-2 text-sm text-yellow-600">
                  No teams available.{" "}
                  <Link
                    href="/teams/create"
                    className="text-blue-600 hover:underline"
                  >
                    Create a team first
                  </Link>
                  .
                </p>
              )}
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
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
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
                placeholder="Describe the project goals, objectives, and requirements..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/projects"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || teams.length === 0}
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
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
