import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const {
    isLoading: roleLoading,
    data: role, // ❌ NO DEFAULT HERE
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    },
  });

  return { role, roleLoading };
};

export default useRole;
