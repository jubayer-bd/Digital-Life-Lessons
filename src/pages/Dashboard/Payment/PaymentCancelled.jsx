import React from "react";
import { Link } from "react-router";

const PaymentCancelled = () => {
  return (
    <div>
      <h2 className="text-4xl">Payment is Cancel , Plz try Again</h2>
      <Link to="/dashboard/my-parcels">
        <button className="btn btn-primary mt-5 text-black">
          Go to My Parcels
        </button>
      </Link>
    </div>
  );
};

export default PaymentCancelled;
