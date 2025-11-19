"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux";
import {
  Plus,
  FolderKanban,
  Users,
  Calendar,
  MoreVertical,
  Search,
} from "lucide-react";

export default function ProjectsPage() {
  const { projects } = useAppSelector((state) => state.projects);
  const { teams } = useAppSelector((state) => state.teams);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getTeamName = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.name || "Unknown Team";
  };

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplay = (status: string) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTaskCount = (projectId: number) => {
    // eslint-disable-next-line react-hooks/purity
    return Math.floor(Math.random() * 10);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage and track your projects</p>
          </div>
          <Link
            href="/projects/create"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl w-fit"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </Link>
        </div>

        <div className="my-12">
          {projects.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    projects.filter((p) => (p.status || "active") === "active")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {projects.filter((p) => p.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {projects.filter((p) => p.status === "on-hold").length}
                </div>
                <div className="text-sm text-gray-600">On Hold</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 ">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {projects.length === 0 ? "No projects yet" : "No projects found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {projects.length === 0
                ? "Create your first project to get started"
                : "Try adjusting your search or filters"}
            </p>
            {projects.length === 0 && (
              <Link
                href="/projects/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const taskCount = getTaskCount(project.id);
              const projectStatus = project.status || "active";

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <FolderKanban className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {project.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                            projectStatus
                          )}`}
                        >
                          {getStatusDisplay(projectStatus)}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Users className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {getTeamName(project.teamId)}
                      </div>
                      <div className="text-xs text-gray-600">Team</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900">
                        {taskCount}
                      </div>
                      <div className="text-xs text-gray-600">Tasks</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
