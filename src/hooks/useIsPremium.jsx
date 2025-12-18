import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useIsPremium = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { isLoading: roleLoading, data: isPremium = false } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/isPremium`);
      
      // Convert "true" / "false" (string) to boolean
      return res.data.isPremium === true || res.data.isPremium === "true";
    },
  });

  return { isPremium, roleLoading };
};

export default useIsPremium;
