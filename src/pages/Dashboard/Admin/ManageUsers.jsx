import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  ShieldCheck,
  ShieldOff,
  Search,
  User as UserIcon,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import PageLoader from "../../../components/PageLoader";

const ManageUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH USERS
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // TOGGLE ROLE
  const { mutate: updateRole } = useMutation({
    mutationFn: async ({ id, newRole }) =>
      axiosSecure.patch(`/users/${id}/role`, { role: newRole }),
    onSuccess: (_, variables) => {
      toast.success(`User role updated to ${variables.newRole}`);
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Failed to update role"),
  });

  // DELETE USER
  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "The user has been removed.", "success");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Could not delete user"),
  });

  const handleRoleToggle = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    if (newRole === "user") {
      Swal.fire({
        title: "Demote Admin?",
        text: `Remove admin rights from ${user.displayName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, demote",
      }).then((result) => {
        if (result.isConfirmed) {
          updateRole({ id: user._id, newRole });
        }
      });
    } else {
      updateRole({ id: user._id, newRole });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <PageLoader text="Loading Users..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Manage Users
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Members:{" "}
            <span className="font-bold text-blue-600">{users.length}</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- MOBILE & SMALL TABLET VIEW (Cards) --- */}
      {/* Visible up to 'md' breakpoint (768px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={20} className="text-blue-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {user.displayName || "Unknown User"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Card Footer / Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-500 font-medium">
                Lessons:{" "}
                <span className="text-gray-800">{user.totalLessons || 0}</span>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRoleToggle(user)}
                  className={`p-2 rounded-lg transition-colors ${
                    user.role === "admin"
                      ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                  title={user.role === "admin" ? "Remove Admin" : "Make Admin"}
                >
                  {user.role === "admin" ? (
                    <ShieldOff size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete User"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* --- TABLET & DESKTOP VIEW (Table) --- */}
      {/* Hidden on mobile, visible on 'md' (768px) and up */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="p-5 pl-6">User Identity</th>
                <th className="p-5">Current Role</th>
                <th className="p-5 text-center">Lessons Taken</th>
                <th className="p-5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon size={18} className="text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.displayName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {user.role === "admin" ? "Administrator" : "Student"}
                      </span>
                    </td>

                    <td className="p-4 text-center whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                        {user.totalLessons || 0}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRoleToggle(user)}
                          className={`p-2 rounded-lg transition-all ${
                            user.role === "admin"
                              ? "hover:bg-orange-100 text-gray-400 hover:text-orange-600"
                              : "hover:bg-green-100 text-gray-400 hover:text-green-600"
                          }`}
                          title={
                            user.role === "admin"
                              ? "Demote Admin"
                              : "Make Admin"
                          }
                        >
                          {user.role === "admin" ? (
                            <ShieldOff size={19} />
                          ) : (
                            <ShieldCheck size={19} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
