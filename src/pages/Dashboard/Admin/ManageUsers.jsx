import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  ShieldCheck,
  ShieldOff,
  Search,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import PageLoader from "../../../components/PageLoader";

const ManageUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH USERS
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // 2. TOGGLE ROLE MUTATION
  const { mutate: updateRole } = useMutation({
    mutationFn: async ({ id, newRole }) => {
      return axiosSecure.patch(`/users/${id}/role`, { role: newRole });
    },
    onSuccess: (_, variables) => {
      toast.success(`User role updated to ${variables.newRole}`);
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Failed to update role"),
  });

  // 3. DELETE USER MUTATION
  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "The user has been removed.", "success");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Could not delete user"),
  });

  // HANDLERS
  const handleRoleToggle = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    if (newRole === "user") {
      Swal.fire({
        title: "Demote Admin?",
        text: `Are you sure you want to remove Admin rights from ${user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
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
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
      }
    });
  };

  // FILTER LOGIC
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <PageLoader text="Loading Users..." />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
          <p className="text-sm text-gray-500">
            Total Members:{" "}
            <span className="font-bold text-blue-600">{users.length}</span>
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Lessons</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    {/* User Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-white shadow-sm">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck size={12} />
                        ) : (
                          <UserIcon size={12} />
                        )}
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="p-4 text-center">
                      <span className="font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs">
                        {user.totalLessons || 0}
                      </span>
                    </td>

                    {/* Actions - Always Visible */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Role Button */}
                        <button
                          onClick={() => handleRoleToggle(user)}
                          className={`p-2 rounded-lg transition-colors tooltip tooltip-left ${
                            user.role === "admin"
                              ? "text-orange-500 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={
                            user.role === "admin"
                              ? "Demote to User"
                              : "Promote to Admin"
                          }
                        >
                          {user.role === "admin" ? (
                            <ShieldOff size={18} />
                          ) : (
                            <ShieldCheck size={18} />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
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