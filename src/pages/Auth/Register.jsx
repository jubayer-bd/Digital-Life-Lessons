import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { app } from "../../Firebase/firebase.config";
import { AuthContext } from "../../context/AuthContext";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const { createUser, setLoading, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setBtnLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    document.title = "Register | UtilityBill";
  });
  //  Password Validation
  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pass)) return "Must include an uppercase letter";
    if (!/[a-z]/.test(pass)) return "Must include a lowercase letter";
    return "";
  };

  //  Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      setPasswordError(errorMsg);
      return;
    }

    setPasswordError("");
    setBtnLoading(true);
    setLoading(true);

    try {
      const res = await createUser(email, password);

      await updateProfile(res.user, {
        displayName: name,
        photoURL: photo || "",
      });

      setUser({
        ...res.user,
        displayName: name,
        photoURL: photo || "",
      });

      toast.success("🎉 Registration successful!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message || "Registration failed!");
    } finally {
      setBtnLoading(false);
      setLoading(false);
    }
  };

  // 🔹 Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      toast.success("🎉 Logged in with Google!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message || "Google login failed!");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  if (pageLoading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10 my-10 ">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className=" label-text font-medium">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Photo URL</span>
            </label>
            <input
              type="text"
              placeholder="Enter your photo URL"
              className="input input-bordered w-full"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                type="button"
                className="absolute right-3 top-3 text-xl text-gray-500 z-10 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="divider">or</div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-2xl" /> Continue with Google
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            className="text-primary hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
