import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});
const useAxios = () => {
  const { user, logout } = useAuth();
  useEffect(() => {
    // intercept requests
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${user?.accessToken}`;
        // console.log(config);

        return config;
      }
    );
    // intercept responses
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);
        const statusCode = error.status;
        if (statusCode === 401 || statusCode === 403) {
          // handle unauthorized access
          logout().then(() => {
            window.location.href = "/auth/login";
          });
        }
        return Promise.reject(error);
      }
    );

    // eject interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logout]);
  return axiosSecure;
};

export default useAxios;
