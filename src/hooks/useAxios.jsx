import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://life-lessons-server-side.vercel.app/",
  // baseURL: "http://localhost:3000/",
});

const useAxios = () => {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // 1. Request Interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // If we are still loading, don't try to attach the token yet
        if (loading) {
            return config;
        }
        
        // Only attach token if user exists
        if (user && user.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const statusCode = error.response?.status;

        // PREVENT BUG: Don't logout if we are still in the initial loading phase
        if (!loading && (statusCode === 401 || statusCode === 403)) {
          await logout();
        }

        return Promise.reject(error);
      }
    );

    // eject interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
    
    // FIX: Add 'loading' to dependencies so interceptors refresh when loading finishes
  }, [user, logout, loading]); 

  return axiosSecure;
};

export default useAxios;