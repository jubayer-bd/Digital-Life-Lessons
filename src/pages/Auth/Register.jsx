import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const Register = () => {
  const { registerUser, updateUserProfile, googleSignIn } = useAuth();
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

  const handleRegistration = async (data) => {
    setLoading(true);

    try {
      // --------------------------
      // 1. CREATE ACCOUNT
      // --------------------------
      const userCredential = await registerUser(data.email, data.password);
      const user = userCredential.user;

      // --------------------------
      // 2. UPLOAD IMAGE TO IMGBB
      // --------------------------
      const profileImg = data.photo[0];
      const formData = new FormData();
      formData.append("image", profileImg);

      const imgApiUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host
      }`;

      const imgResponse = await axios.post(imgApiUrl, formData);

      const photoURL = imgResponse.data.data.url;
      const userInfo = {
        email: data.email,
        displayName: data.name,
        photoURL: photoURL,
      };
      axiosSecure.post("/users", userInfo).then((res) => {
        if (res.data.insertedId) {
          console.log("User info saved:", res.data);
        }
      });

      // --------------------------
      // 3. UPDATE FIREBASE PROFILE
      // --------------------------

      const userProfile = {
        displayName: data.name,
        photoURL: photoURL,
      };
      // console.log(userProfile);
      await updateUserProfile(userProfile);

      // --------------------------
      // 4. SUCCESS
      // --------------------------
      toast.success("Account Created Successfully!");
      navigate(location?.state || "/");
    } catch (error) {
      console.log(error);
      toast.error("Registration Failed. Try Again.");
    } finally {
      setLoading(false);
    }
  };
  // ----------social login handler ----------
  const handleGoogleSignIn = async () => {
    setLoading(true);
    googleSignIn()
      .then((result) => {
        toast.success("SignUp Successfully");
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
      .catch(() => toast.error("SignUp Failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white py-10 px-5 rounded-xl">
      <div className="pb-5">
        {/* <Logo /> */}
      </div>

      
        {/* LEFT FORM */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center px-10"
        >
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold mb-2 text-gray-800">
              Create Account
            </h2>
            <p className="text-gray-500 mb-6">Register with ZapShift</p>

            <form
              onSubmit={handleSubmit(handleRegistration)}
              className="space-y-3"
            >
              {/* Name */}
              <div>
                <label className="font-semibold text-sm">Name</label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Your Name"
                  className="input input-bordered w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">Name is required</p>
                )}
              </div>

              {/* Photo */}
              <div>
                <label className="font-semibold text-sm">Photo</label>
                <input
                  type="file"
                  {...register("photo", { required: true })}
                  className="file-input input-bordered w-full"
                />
                {errors.photo && (
                  <p className="text-red-500 text-xs">Photo is required</p>
                )}
              </div>

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
                    {...register("password", { required: true, minLength: 6 })}
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

                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-xs">Password is required</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500 text-xs">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                disabled={loading}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  state={location.state}
                  to={"/auth/login"}
                  className="font-semibold text-primary"
                >
                  Login
                </Link>
              </p>

              <div className="divider">OR</div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn w-full border"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                />
                {loading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  " Register with Google"
                )}
              </button>
            </form>
          </div>
        </motion.div>

      
      </div>
    
  );
};

export default Register;
