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

  // --- DATA FETCHING ---
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // --- MUTATIONS ---
  const { mutate: updateRole } = useMutation({
    mutationFn: async ({ id, newRole }) =>
      axiosSecure.patch(`/users/${id}/role`, { role: newRole }),
    onSuccess: (_, variables) => {
      toast.success(`User role updated to ${variables.newRole}`);
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Failed to update role"),
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "The user has been removed.", "success");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => toast.error("Could not delete user"),
  });

  // --- HANDLERS ---
  const handleRoleToggle = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (newRole === "user") {
      Swal.fire({
        title: "Demote Admin?",
        text: `Remove admin rights from ${user.displayName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, demote",
        confirmButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) updateRole({ id: user._id, newRole });
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
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) deleteUser(id);
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <PageLoader text="Loading Users..." />;

  return (
    // Outer container: overflow-hidden ensures no scrollbar triggers from margins
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-hidden">
      
      {/* --- HEADER SECTION --- */}
      {/* Stack vertically on mobile, horizontal on md+ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Manage Users
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Members:{" "}
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- CARD VIEW (Visible on SM and MD, Hidden on LG) --- */}
      {/* grid-cols-1 for mobile, grid-cols-2 for tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* Card Content */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
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
                {/* Text Info */}
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 truncate text-base">
                    {user.displayName || "Unknown User"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              
              {/* Role Badge */}
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                  user.role === "admin"
                    ? "bg-purple-50 text-purple-700 border-purple-100"
                    : "bg-gray-50 text-gray-600 border-gray-100"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
              <div className="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg">
                Lessons: <span className="text-gray-900 font-bold">{user.totalLessons || 0}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRoleToggle(user)}
                  className={`p-2 rounded-xl transition-colors ${
                    user.role === "admin"
                      ? "bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
                  }`}
                  title={user.role === "admin" ? "Remove Admin" : "Make Admin"}
                >
                  {user.role === "admin" ? <ShieldOff size={18} /> : <ShieldCheck size={18} />}
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 border border-red-100 transition-colors"
                  title="Delete User"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-400">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* --- TABLE VIEW (Hidden on SM and MD, Visible on LG) --- */}
      {/* We strictly use lg:block here to ensure table only appears when screen is wide enough */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* We removed overflow-x-auto to strictly follow 'no scrollbar' rule. 
            Instead, we use 'w-full' and 'truncate' on cells to keep it contained. */}
        <div className="w-full">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="w-[40%] p-6 text-xs uppercase font-semibold text-gray-500 tracking-wider">User Identity</th>
                <th className="w-[20%] p-6 text-xs uppercase font-semibold text-gray-500 tracking-wider">Role Access</th>
                <th className="w-[15%] p-6 text-center text-xs uppercase font-semibold text-gray-500 tracking-wider">Activity</th>
                <th className="w-[25%] p-6 pr-8 text-right text-xs uppercase font-semibold text-gray-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="p-5 pl-6">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={20} className="text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        {/* Truncate ensures text cuts off with '...' instead of pushing width */}
                        <p className="font-semibold text-gray-900 truncate">{user.displayName || "Unknown"}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {user.role === "admin" ? "Administrator" : "Student"}
                    </span>
                  </td>

                  <td className="p-5 text-center">
                    <span className="inline-block min-w-[3rem] text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                      {user.totalLessons || 0}
                    </span>
                  </td>

                  <td className="p-5 pr-8 text-right">
                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => handleRoleToggle(user)}
                        className={`p-2 rounded-lg transition-all ${
                          user.role === "admin"
                            ? "hover:bg-orange-100 text-gray-400 hover:text-orange-600"
                            : "hover:bg-green-100 text-gray-400 hover:text-green-600"
                        }`}
                      >
                        {user.role === "admin" ? <ShieldOff size={18} /> : <ShieldCheck size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
             <div className="text-center py-12 text-gray-400">
               No users found matching "{searchTerm}"
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;