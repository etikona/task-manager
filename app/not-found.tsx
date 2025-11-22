"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <FileQuestion className="w-32 h-32 text-gray-300 mx-auto" />
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-red-600">404</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we could not find the page you are looking for. It might have
          been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
