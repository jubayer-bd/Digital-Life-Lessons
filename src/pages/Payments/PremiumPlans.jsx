import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import useIsPremium from "../../hooks/useIsPremium";

export default function PremiumPlans() {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { isPremium } = useIsPremium();
  console.log(isPremium);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Hide page if already premium
  if (isPremium) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">
            You’re a <span className="text-blue-600">Premium</span> Member ⭐
          </h2>
          <p className="text-gray-600">
            Enjoy unlimited access to all premium features.
          </p>
        </div>
      </div>
    );
  }

  const handleUpgrade = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to upgrade your plan.",
      });
      return navigate("/login", { state: { from: "/pricing/upgrade" } });
    }

    setIsRedirecting(true);

    try {
      const payload = {
        name: user.displayName,
        email: user.email,
        price: 1500,
      };

      const res = await axiosSecure.post("payment-checkout-session", payload);

      if (!res?.data?.url) {
        throw new Error("Stripe checkout URL missing");
      }

      // ✅ Page navigation loading only
      window.location.replace(res.data.url);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Unable to start payment. Please try again.",
      });
      setIsRedirecting(false);
    }
  };

  const features = [
    { label: "Lesson Access", free: "Limited", premium: "Unlimited" },
    { label: "Create Premium Lessons", free: "No", premium: "Yes" },
    { label: "Access Premium Lessons", free: "No", premium: "Yes" },
    { label: "Ad-Free Experience", free: "No", premium: "Yes" },
    { label: "Priority Lesson Listing", free: "No", premium: "Yes" },
    { label: "Downloadable Resources", free: "No", premium: "Yes" },
    { label: "Early Feature Access", free: "No", premium: "Yes" },
    { label: "Priority Support", free: "No", premium: "Yes" },
  ];

  return (
    <section className="max-w-4xl mx-auto my-20 px-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">
          Upgrade to <span className="text-blue-600">Premium</span>
        </h1>
        <p className="text-gray-600 mt-3">
          One-time payment. Lifetime access. No hidden fees.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl  shadow-sm bg-white">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 text-left px-6">Features</th>
              <th>Free</th>
              <th className="text-blue-600">Premium</th>
            </tr>
          </thead>

          <tbody>
            {features.map((item, index) => (
              <tr key={index} className=" hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-medium text-left">
                  {item.label}
                </td>
                <td className="text-red-500 font-semibold">{item.free}</td>
                <td className="text-green-600 font-semibold">{item.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={handleUpgrade}
          disabled={isRedirecting}
          className="px-10 py-4 bg-blue-600 text-white text-lg rounded-xl shadow-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isRedirecting
            ? "Redirecting to Stripe..."
            : "Upgrade to Premium — ৳1500"}
        </button>

        <p className="text-sm mt-3 text-gray-500">
          Secure payment • Lifetime access
        </p>
      </div>
    </section>
  );
}
