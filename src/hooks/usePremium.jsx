import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useIsPremium = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { isLoading: roleLoading, data: isPremium = false } = useQuery({
    queryKey: ["user-role", user?.email],

    // Only run query if email exists
    enabled: !!user?.email,

    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/isPremium`);
      return res.data.isPremium; // ✔ return only the role string
    },
  });

  return { isPremium, roleLoading };
};

export default useIsPremium;
