"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { deleteProject, updateProject } from "@/store/slices/projectSlice";
import {
  ArrowLeft,
  FolderKanban,
  Users,
  Calendar,
  Trash2,
  Edit,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);

  const { projects } = useAppSelector((state) => state.projects);
  const { teams, members } = useAppSelector((state) => state.teams);
  const { tasks } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();

  const project = projects.find((p) => p.id === projectId);
  const team = teams.find((t) => t.id === project?.teamId);
  const teamMembers = members.filter((m) => m.teamId === project?.teamId);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "active",
    teamId: project?.teamId || 0,
  });

  const getMemberTaskCount = (memberId: number) => {
    return tasks.filter((task) => task.assignedMemberId === memberId).length;
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Project not found
          </h2>
          <p className="text-gray-600 mb-6">
            The project you are looking for does not exist.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const handleDeleteProject = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      dispatch(deleteProject(projectId));
      router.push("/projects");
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      setEditedProject({
        name: project.name,
        description: project.description || "",
        status: project.status || "active",
        teamId: project.teamId || 0,
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveProject = () => {
    if (!editedProject.name.trim()) {
      alert("Project name is required");
      return;
    }

    dispatch(
      updateProject({
        id: projectId,
        name: editedProject.name,
        description: editedProject.description,
        status: editedProject.status,
      })
    );
    setIsEditMode(false);
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
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  const getOverloadedMembers = () => {
    return teamMembers.filter((member) => {
      const taskCount = getMemberTaskCount(member.id);
      return taskCount > member.capacity;
    }).length;
  };

  const projectStatus = project.status || "active";

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editedProject.name}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        name: e.target.value,
                      })
                    }
                    className="text-3xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-gray-900 outline-none bg-transparent w-full max-w-2xl"
                    placeholder="Project name"
                  />
                  <textarea
                    value={editedProject.description}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        description: e.target.value,
                      })
                    }
                    className="text-gray-600 border border-gray-300 rounded-lg p-3 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none w-full max-w-2xl resize-none"
                    placeholder="Project description"
                    rows={3}
                  />
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editedProject.status}
                        onChange={(e) =>
                          setEditedProject({
                            ...editedProject,
                            status: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team
                      </label>
                      <select
                        value={editedProject.teamId}
                        onChange={(e) =>
                          setEditedProject({
                            ...editedProject,
                            teamId: parseInt(e.target.value),
                          })
                        }
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                      >
                        <option value={0}>No team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {project.name}
                    </h1>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        projectStatus
                      )}`}
                    >
                      {getStatusDisplay(projectStatus)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      {project.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 ml-6">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleSaveProject}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <Edit className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <FolderKanban className="w-6 h-6 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {tasks.filter((t) => t.projectId === projectId).length}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {teamMembers.length}
                </div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {
                    tasks.filter(
                      (t) => t.projectId === projectId && t.status === "done"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Completed Tasks</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {getOverloadedMembers()}
                </div>
                <div className="text-sm text-gray-600">Overloaded Members</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Team Information
              </h2>
              {team ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{team.name}</h3>
                      {team.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {team.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/teams/${team.id}`}
                      className="text-sm text-gray-900 hover:text-gray-700 font-medium"
                    >
                      View Team →
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Team Members
                    </h4>
                    <div className="space-y-3">
                      {teamMembers.slice(0, 5).map((member) => {
                        const currentTasks = getMemberTaskCount(member.id);
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {member.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {member.role}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                currentTasks > member.capacity
                                  ? "bg-red-100 text-red-800"
                                  : currentTasks === member.capacity
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {currentTasks}/{member.capacity}
                            </div>
                          </div>
                        );
                      })}
                      {teamMembers.length > 5 && (
                        <div className="text-sm text-gray-500 text-center">
                          +{teamMembers.length - 5} more members
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  No team assigned to this project.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project Details
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Created
                  </div>
                  <div className="text-sm text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Status
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        projectStatus
                      )}`}
                    >
                      {getStatusDisplay(projectStatus)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Team</div>
                  <div className="text-sm text-gray-900">
                    {team?.name || "No team assigned"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href={`/projects/${project.id}/tasks`}
                  className="block w-full text-left px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  View Tasks
                </Link>
                <button className="block w-full text-left px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                  Add New Task
                </button>
                <button className="block w-full text-left px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
