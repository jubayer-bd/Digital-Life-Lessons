// useRole.jsx
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useRole = () => {
  const { user, loading } = useAuth(); // Ensure you grab auth loading state too if available
  const axiosSecure = useAxios();

  const { isLoading: roleLoading, data: role } = useQuery({
    // FIX: Change key to "user-role-string" to avoid collision with boolean hooks
    queryKey: ["user-role-string", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      // Ensure we return the role string (or null)
      return res.data?.role;
    },
  });

  return { role, roleLoading };
};

export default useRole;
