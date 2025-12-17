import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
const axiosSecure = axios.create({
  // baseURL: "https://life-lessons-server-side.vercel.app/",
  baseURL: "http://localhost:3000/",
});
const useAxios = () => {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // intercept requests
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (!loading && user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      }
    );

    // intercept responses
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status;

        if (!loading && (statusCode === 401 || statusCode === 403)) {
          logout().then(() => {
            window.location.href = "/login";
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
