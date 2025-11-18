// app/projects/page.tsx
"use client";

// import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProjectsPage() {
  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">
              Projects management page - coming soon!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
