// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// import CheckoutForm from './checkoutForm'
// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe('pk_test_51OFps8DNVCeKwCqLpSX4NOCqD3J4pEwYSHVilCTeVtBlB9vryZ6qf2nuM7vNav5h3AD8LsvhbCqWy6FBR7KivMaB00Lex9XSLd');

// export default function Checkout() {

//   return (
//     <Elements stripe={stripePromise} >
//       <CheckoutForm />
//     </Elements>
//   );
// };

import React from "react";
import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import styles from "./CheckoutView.module.css";

function CheckoutView() {
  const stripePromise = loadStripe(
    `pk_test_51OFps8DNVCeKwCqLpSX4NOCqD3J4pEwYSHVilCTeVtBlB9vryZ6qf2nuM7vNav5h3AD8LsvhbCqWy6FBR7KivMaB00Lex9XSLd`
  );

  return (
    <div className={`mx-auto ${styles.checkoutViewMain}`}>
      <div className="text-center">
        <h1 className="font-bold text-[24px] text-[#474749]">Confirm your Payment</h1>
        <p className="text-muted mt-2">
          You are being charged €10 because your school is not a Gold-Platinum
          school
        </p>
      </div>
      <div className="w-100 mt-5">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}

export default CheckoutView;
