"use client";

import { useState, useEffect } from "react";
import { X, User, Briefcase, Target, AlertTriangle } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  onSave: (updatedMember: any) => void;
}

export default function EditMemberModal({
  isOpen,
  onClose,
  member,
  onSave,
}: EditMemberModalProps) {
  const { tasks } = useAppSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    capacity: 3,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    role?: string;
  }>({});

  // Calculate current tasks dynamically
  const currentTasks = member
    ? tasks.filter((task) => task.assignedMemberId === member.id).length
    : 0;

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        role: member.role || "",
        capacity: member.capacity || 3,
      });
    }
  }, [member]);

  const validateForm = () => {
    const newErrors: { name?: string; role?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!member) return;

    onSave({
      id: member.id,
      name: formData.name,
      role: formData.role,
      capacity: formData.capacity,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "number"
        ? parseInt(e.target.value) || 0
        : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleClose = () => {
    setFormData({ name: "", role: "", capacity: 3 });
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !member) return null;

  const isOverloaded = currentTasks > formData.capacity;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Team Member
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Update member details and workload
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 hover:border-gray-300 focus:border-transparent"
                  }`}
                  placeholder="Enter member name"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.role
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 hover:border-gray-300 focus:border-transparent"
                  }`}
                  placeholder="Enter role"
                />
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.role}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Capacity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 appearance-none bg-white"
                >
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "task" : "tasks"}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Maximum number of tasks this member can handle comfortably
              </p>
            </div>

            {/* Workload Summary */}
            <div
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isOverloaded
                  ? "bg-red-50 border-red-200"
                  : currentTasks === formData.capacity
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Workload Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Tasks:</span>
                  <span
                    className={`font-semibold ${
                      isOverloaded ? "text-red-700" : "text-gray-900"
                    }`}
                  >
                    {currentTasks}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.capacity}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      isOverloaded
                        ? "bg-red-100 text-red-800"
                        : currentTasks === formData.capacity
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isOverloaded
                      ? "Overloaded"
                      : currentTasks === formData.capacity
                      ? "At Capacity"
                      : "Available"}
                  </span>
                </div>
              </div>
              {isOverloaded && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      This member is overloaded! Consider reassigning tasks or
                      increasing capacity.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white/95 backdrop-blur-sm sticky bottom-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 px-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-95 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 py-3.5 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 active:scale-95 order-1 sm:order-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
