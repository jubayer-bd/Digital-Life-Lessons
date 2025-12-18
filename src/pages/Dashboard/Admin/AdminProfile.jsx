import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Camera, User, Save, Mail } from "lucide-react";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
import PageLoader from "../../../components/PageLoader";
import useAuth from "../../../hooks/useAuth";

const AdminProfile = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const { updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({ name: "", photo: "" });

  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/profile");
      return res.data;
    },
  });

  // Sync internal state when data arrives
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.displayName || "",
        photo: admin.photoURL || "",
      });
    }
  }, [admin]);

  const { mutate: handleUpdate, isPending } = useMutation({
    mutationFn: async () => {
      // 1. Update Firebase First
      await updateUserProfile({displayName:formData.name ,photoURL:formData.photo});
      // 2. Update Database
      return axiosSecure.patch("/users/profile", {
        displayName: formData.name,
        photoURL: formData.photo,
      });
    },
    onSuccess: () => {
      toast.success("Profile synchronized everywhere!", { id: "profile-upd" });
      queryClient.invalidateQueries(["admin-profile"]);
    },
    onError: (err) => {
      toast.error(err.message || "Update failed", { id: "profile-upd" });
    },
  });

  if (isLoading) return <PageLoader text="Accessing Secure Profile..." />;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Admin Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your administrative identity and credentials.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border shadow-xl p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-blue-50 transition-all group-hover:ring-blue-100">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={64} />
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-blue-600 p-2.5 rounded-full text-white shadow-lg">
                <Camera size={18} />
              </div>
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-800">
              {admin?.displayName || "Admin"}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> System Administrator
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border shadow-sm p-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    value={admin?.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.value })
                  }
                  placeholder="https://images.com/your-photo.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  toast.loading("Updating records...", { id: "profile-upd" });
                  handleUpdate();
                }}
                disabled={isPending}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-70"
              >
                {isPending ? (
                  "Syncing..."
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
