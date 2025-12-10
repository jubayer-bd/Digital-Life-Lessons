import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

export default function PremiumPlans() {
  const axiosSecure = useAxios();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      return Swal.fire("Error", "Please login first!", "error");
    }

    setLoading(true);

    try {
      const paymentInfo = {
        name: user.displayName,
        email: user.email,
        price: 1500,
      };

      const res = await axiosSecure.post(
        "/payment-checkout-session",
        paymentInfo
      );

      if (res.data?.url) {
        window.location.assign(res.data.url);
      }
    } catch (error) {
      Swal.fire("Error", "Unable to start payment session.", "error");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { label: "Access to Lessons", free: "Limited", premium: "Unlimited" },
    { label: "Premium Lesson Access", free: "No", premium: "Yes" },
    { label: "Create Premium Lessons", free: "No", premium: "Yes" },
    { label: "Ad-Free Experience", free: "No", premium: "Yes" },
    { label: "Priority Lesson Listing", free: "No", premium: "Yes" },
    { label: "Downloadable Resources", free: "No", premium: "Yes" },
    { label: "Early Access to New Features", free: "No", premium: "Yes" },
    { label: "Priority Support", free: "No", premium: "Yes" },
  ];

  return (
    <div className="max-w-4xl mx-auto my-16 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        Upgrade to <span className="text-blue-600">Premium</span>
      </h2>

      <div className="overflow-x-auto shadow-xl rounded-xl bg-white">
        <table className="table w-full text-center">
          <thead>
            <tr className="bg-gray-100 text-lg">
              <th className="py-4">Features</th>
              <th>Free</th>
              <th>Premium</th>
            </tr>
          </thead>

          <tbody>
            {features.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="font-medium py-3">{item.label}</td>
                <td className="text-red-500 font-semibold">{item.free}</td>
                <td className="text-green-600 font-semibold">{item.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Redirecting..." : "Upgrade to Premium – ৳1500"}
        </button>

        <p className="text-sm mt-3 text-gray-500">
          One-time payment • Lifetime access
        </p>
      </div>
    </div>
  );
}
