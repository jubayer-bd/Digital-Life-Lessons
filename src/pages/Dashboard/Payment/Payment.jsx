import React, { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";


const Payment = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    // Prevent double clicking
    if (loading) return;
    setLoading(true);

    try {
      const paymentInfo = {
        name: user?.displayName || "Unknown User", // Backend expects name
        email: user?.email,
      };

      // Calls the correct endpoint defined in index.js
      const res = await axiosSecure.post(
        "/payment-checkout-session",
        paymentInfo
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setLoading(false); // Only reset loading if there is an error
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
              <th className="py-4 text-left pl-6">Features</th>
              <th>Free</th>
              <th>Premium</th>
            </tr>
          </thead>

          <tbody>
            {features.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 border-b">
                <td className="font-medium py-3 text-left pl-6">
                  {item.label}
                </td>
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
          className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Redirecting...
            </>
          ) : (
            "Upgrade to Premium – ৳1500"
          )}
        </button>

        <p className="text-sm mt-3 text-gray-500">
          One-time payment • Lifetime access
        </p>
      </div>
    </div>
  );
};

export default Payment;
