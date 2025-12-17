import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Upload, User, Mail, Lock } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const Register = () => {
  const { registerUser, updateUserProfile, googleSignIn, user } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxios();

  const {
    register,
    handleSubmit,
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

  const handleRegistration = async (data) => {
    setLoading(true);
    try {
      // 1. Create Account
      const userCredential = await registerUser(data.email, data.password);

      // 2. Upload Image
      const profileImg = data.photo[0];
      const formData = new FormData();
      formData.append("image", profileImg);
      const imgApiUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host
      }`;
      const imgResponse = await axios.post(imgApiUrl, formData);
      const photoURL = imgResponse.data.data.url;

      // 3. Save to DB & Firebase
      const userInfo = {
        email: data.email,
        displayName: data.name,
        photoURL: photoURL,
      };

      await axiosSecure.post("/users", userInfo);

      await updateUserProfile({
        displayName: data.name,
        photoURL: photoURL,
      });

      toast.success("Account Created Successfully!");
      navigate(location?.state || "/");
    } catch (error) {
      console.log(error);
      toast.error("Registration Failed. Try Again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      const userInfo = {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      await axiosSecure.post("/users", userInfo);
      toast.success("SignUp Successfully");
      navigate(location?.state || "/");
    } catch (error) {
      toast.error("SignUp Failed");
    } finally {
      setLoading(false);
    }
  };
  if (user) {
    navigate("/");
    toast.error("you are already login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Digital Life Lessons today
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit(handleRegistration)}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            {/* Name */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="Full Name"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-1"
                  >
                    Name is required
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Photo Upload */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative border border-gray-300 border-dashed rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-blue-600">
                  <Upload size={18} />
                  <span className="text-sm font-medium">
                    Upload Profile Photo
                  </span>
                </div>
                <input
                  type="file"
                  {...register("photo", { required: true })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <AnimatePresence>
                {errors.photo && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-1"
                  >
                    Photo is required
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email Address"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-1"
                  >
                    Email is required
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
                {...register("password", { required: true, minLength: 6 })}
                placeholder="Password"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
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
                    {errors.password.type === "required"
                      ? "Password is required"
                      : "Must be at least 6 characters"}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
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

          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg shadow-sm bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
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
          <span className="text-gray-500">Already have an account? </span>
          <Link
            to="/login"
            state={location.state}
            className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
