import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { singInUser, googleSignIn } = useAuth();
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

  const handleLogin = (data) => {
    setLoading(true);
    singInUser(data.email, data.password)
      .then(() => {
        toast.success("Login Successful!");
        navigate(location?.state || "/");
      })
      .catch(() => {
        toast.error("Invalid credentials. Try again.");
      })
      .finally(() => setLoading(false));
  };

  // ----------social login handler ----------
  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        toast.success("SignUp SuccessFully");
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        axiosSecure.post("/users", userInfo).then((res) => {
          if (res.data.insertedId) {
            console.log("User info saved:", res.data);
          }
        });
        navigate(location?.state || "/");
      })
      .catch(() => toast("SignUp Failed"));
  };
  return (
    <div className="py-10 px-5 rounded-xl bg-white">
      <div className="pb-5">
      </div>
    
        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center px-10"
        >
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold mb-2 text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-6">Login with ZapShift</p>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-3">
              {/* Email */}
              <div>
                <label className="font-semibold text-sm">Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">Email is required</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="font-semibold text-sm">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    {...register("password", { required: true })}
                    placeholder="Password"
                    className="input input-bordered w-full"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-sm text-gray-600"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "Hide" : "Show"}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">Password is required</p>
                )}
              </div>

              <a className="link link-hover text-sm">Forgot Password?</a>

              {/* Login Button */}
              <button
                disabled={loading}
                className="btn btn-primary text-black w-full mt-2"
              >
                {loading ? (
                  <span class="loading loading-dots loading-md"></span>
                ) : (
                  "Login"
                )}
              </button>

              <p className="text-center text-gray-600 text-sm">
                Don’t have an account?{" "}
                <Link
                  to={"/auth/register"}
                  state={location.state}
                  className="font-bold text-primary"
                >
                  Register
                </Link>
              </p>

              <div className="divider">OR</div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn w-full border"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                />
                Login with Google
              </button>
            </form>
          </div>
        </motion.div>

      
    </div>
  );
};

export default Login;
