import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Camera } from "lucide-react";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
import PageLoader from "../../../components/PageLoader";

const AdminProfile = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  // 🔹 Fetch admin profile
  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/profile");
      setName(res.data.displayName);
      setPhoto(res.data.photoURL);
      return res.data;
    },
  });

  // 🔹 Update profile mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return axiosSecure.patch("/admin/profile", {
        displayName: name,
        photoURL: photo,
      });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  if (isLoading) return <PageLoader text="Loading Profile..." />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md border p-6 flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={photo || "/avatar.png"}
              alt="Admin"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
            />
            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full">
              <Camera size={14} />
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <ShieldCheck size={14} /> Admin
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Display Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={admin.email}
              disabled
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Profile Photo URL</label>
            <input
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>

      {/* Activity Summary (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Lessons Reviewed", value: admin.stats?.reviewed || 0 },
          { label: "Lessons Deleted", value: admin.stats?.deleted || 0 },
          { label: "Reports Resolved", value: admin.stats?.reports || 0 },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border p-5 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
