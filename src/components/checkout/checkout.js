import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import styles from "./CheckoutView.module.css";

function CheckoutView() {
  const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`);
  const navigate = useNavigate();

  const handleBack = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    navigate("/sign-up", { replace: true });
  };

  return (
    <>
    <div className="mb-0 ml-4 mr-0 mt-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm sm:text-base"
        >
          Back to Signup
        </button>
      </div>
    <div className={`mx-auto ${styles.checkoutViewMain}`}>
      {/* Back Button */}
      

      {/* <div className="text-center">
        <h1 className="font-bold text-[24px] text-[#474749]">Confirm your Payment</h1>
        <p className="text-muted mt-2">
          You are being charged €10 because your school is not a Gold-Platinum school
        </p>
      </div> */}

      <div className="w-100 mt-5">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
    </>
  );
}

export default CheckoutView;
