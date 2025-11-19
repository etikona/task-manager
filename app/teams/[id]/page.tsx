"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  deleteTeam,
  deleteMember,
  updateMember,
} from "@/store/slices/teamSlice";
import {
  ArrowLeft,
  Users,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
} from "lucide-react";
import AddMemberModal from "../../Components/Shared/AddMemberModal";
import EditMemberModal from "../../Components/Shared/EditMemberModal";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = parseInt(params.id as string);

  const { teams, members } = useAppSelector((state) => state.teams);
  const dispatch = useAppDispatch();

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const team = teams.find((t) => t.id === teamId);
  const teamMembers = members.filter((m) => m.teamId === teamId);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Team not found
          </h2>
          <p className="text-gray-600 mb-6">
            The team you are looking for does not exist.
          </p>
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const handleDeleteTeam = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this team? This will also remove all team members."
      )
    ) {
      dispatch(deleteTeam(teamId));
      router.push("/teams");
    }
  };

  const handleDeleteMember = (memberId: number) => {
    dispatch(deleteMember(memberId));
    setMemberToDelete(null);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowEditMemberModal(true);
  };

  const handleUpdateMember = (updatedMember: any) => {
    dispatch(updateMember(updatedMember));
    setShowEditMemberModal(false);
    setSelectedMember(null);
  };

  const getWorkloadStatus = (member: any) => {
    if (member.currentTasks > member.capacity) return "overloaded";
    if (member.currentTasks === member.capacity) return "full";
    return "available";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/teams"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Teams
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              {team.description && (
                <p className="text-gray-600 mt-2">{team.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
            <button
              onClick={handleDeleteTeam}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-300"
            >
              <Trash2 className="w-5 h-5" />
              Delete Team
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">
              {teamMembers.length}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-green-600">
              {
                teamMembers.filter((m) => getWorkloadStatus(m) === "available")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {
                teamMembers.filter((m) => getWorkloadStatus(m) === "full")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">At Capacity</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-red-600">
              {
                teamMembers.filter((m) => getWorkloadStatus(m) === "overloaded")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Overloaded</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Team Members
            </h2>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No members yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add members to get started with task assignments
              </p>
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Current Tasks
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamMembers.map((member) => {
                    const status = getWorkloadStatus(member);
                    const isOverloaded = status === "overloaded";

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {isOverloaded && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {member.capacity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium ${
                              isOverloaded ? "text-red-600" : "text-gray-900"
                            }`}
                          >
                            {member.currentTasks}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              status === "overloaded"
                                ? "bg-red-100 text-red-800"
                                : status === "full"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditMember(member)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setMemberToDelete(member.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        teamId={teamId}
      />

      <EditMemberModal
        isOpen={showEditMemberModal}
        onClose={() => {
          setShowEditMemberModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSave={handleUpdateMember}
      />

      {memberToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Member
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this member? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(memberToDelete)}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
