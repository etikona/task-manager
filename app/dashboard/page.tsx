// app/dashboard/page.tsx
"use client";

// import ProtectedRoute from '@/components/ProtectedRoute'
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { teams } = useAppSelector((state) => state.teams);
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Teams
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {teams.length}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Projects
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {projects.length}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Tasks
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {tasks.length}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Tasks
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {tasks.filter((task) => task.status === "pending").length}
                </dd>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/teams"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Teams
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Manage Projects
              </Link>
              <Link
                href="/tasks"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Manage Tasks
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Getting Started
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Welcome to your Smart Task Manager! Here's how to get started:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Create a team and add team members</li>
                <li>Create projects and assign them to teams</li>
                <li>Add tasks to projects and assign them to team members</li>
                <li>
                  Use the reassign feature to balance workloads automatically
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
