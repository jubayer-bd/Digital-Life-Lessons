import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2, ShieldCheck, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const Login = () => {
  const { signInUser, googleSignIn, user } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    setValue, // Used to auto-fill fields
    formState: { errors },
  } = useForm();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await signInUser(data.email, data.password);
      toast.success("Welcome Back!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Handler
  const handleDemoLogin = (role) => {
    if (role === "admin") {
      setValue("email", "digital@admin.com");
      setValue("password", "Admin1234");
    } else {
      setValue("email", "digital@user.com");
      setValue("password", "User1234");
    }
    toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} credentials filled!`);
  };

  const handleSocialSignIn = async (provider) => {
    setLoading(true);
    try {
      let result;
      if (provider === "google") {
        result = await googleSignIn();
      } else {
        // Implement Facebook Sign In logic here if needed
        toast.error("Facebook login not configured yet");
        setLoading(false);
        return;
      }

      const userInfo = {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };

      await axios.post(
        "https://life-lessons-server-side.vercel.app/users",
        userInfo
      );

      toast.success("Login Successful");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(`${provider} Login Failed`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !location.state?.from) {
      navigate("/", { replace: true });
    }
  }, [user, navigate, location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Digital Life Lessons account
          </p>
        </motion.div>

        {/* Demo Login Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <button
            onClick={() => handleDemoLogin("user")}
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-100"
          >
            <User size={14} /> Demo User
          </button>
          <button
            onClick={() => handleDemoLogin("admin")}
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors border border-purple-100"
          >
            <ShieldCheck size={14} /> Demo Admin
          </button>
        </motion.div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div className="space-y-4">
            {/* Email */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email Address"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPass ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                 <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-2">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialSignIn("google")}
              disabled={loading}
              type="button"
              className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              Google
            </motion.button>

            
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link
            to="/register"
            state={location.state}
            className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            Register
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;