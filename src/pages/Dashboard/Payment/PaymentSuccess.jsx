import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router"; // Assuming react-router v6+
import useAxios from "../../../hooks/useAxios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ref to ensure useEffect only calls API once
  const isFetched = useRef(false);

  useEffect(() => {
    // Prevent function if no session ID or if already fetched
    if (!session_id || isFetched.current) {
      if (!session_id) setLoading(false);
      return;
    }

    isFetched.current = true; // Mark as fetched immediately

    axiosSecure
      .patch(`/payment-success?session_id=${session_id}`)
      .then((res) => {
        if (res.data.success) {
          setPaymentInfo({
            transactionId: res.data.transactionId,
            trackingId: res.data.trackingId,
          });
        } else {
          setError("Payment verification failed. Please contact support.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong verifying your payment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session_id, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-xl font-semibold">Verifying Payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
        <h2 className="text-3xl font-bold">Error</h2>
        <p className="mt-2 text-lg">{error}</p>
        <button onClick={() => navigate("/")} className="btn btn-neutral mt-4">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-base-100">
      <div className="card w-96 bg-base-100 shadow-xl border border-green-200">
        <div className="card-body text-center">
          <div className="flex justify-center mb-4">
            {/* Simple SVG Checkmark */}
            <svg
              className="w-20 h-20 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mb-6">Thank you for your purchase.</p>

          <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2">
            <div>
              <p className="text-xs text-gray-400 uppercase">Transaction ID</p>
              <p className="font-mono text-sm break-all">
                {paymentInfo?.transactionId}
              </p>
            </div>
            <div className="divider my-1"></div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Tracking ID</p>
              <p className="font-mono text-sm font-bold text-primary">
                {paymentInfo?.trackingId}
              </p>
            </div>
          </div>

          <div className="card-actions justify-center mt-6">
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary w-full"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
