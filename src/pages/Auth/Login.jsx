import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../../Firebase/firebase.config";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const googleProvider = new GoogleAuthProvider();

  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    document.title = "Login | UtilityBill";
  });
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  //  Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    // setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Login successful 🎉");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Invalid email or password!");
    } finally {
      setBtnLoading(false);
      // setLoading(false);
    }
  };

  //  Google Login
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google 🎉");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Google login failed!");
    }
  };

  // Show loader before login form
  if (pageLoading) return <div>Loading</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
                className="absolute right-3 top-3 text-xl text-gray-500 cursor-pointer z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <span
              type="button"
              className="text-sm text-primary hover:underline"
              // onClick={() => navigate("/forgot-password", { state: { email } })}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={btnLoading}
            className="btn btn-primary w-full"
          >
            {btnLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">or</div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-2xl" /> Continue with Google
        </button>

        {/* Sign Up link */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <button
            className="text-primary hover:underline"
            onClick={() => navigate("/register")}
          >
            SignUp here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
