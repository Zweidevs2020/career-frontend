"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { postApiWithAuth } from "../../../utils/api";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const [secret, setSecret] = useState("");

  const getData = async () => {
    const hostUrl = window.location.origin;
    console.log(hostUrl);
    const response = await postApiWithAuth("user/billing/subscription/", {
      action: "create",
      base_url: hostUrl,
    });
    setSecret(response?.data?.data?.clientSecret);
  };

  useEffect(() => {
    getData();
  }, []);

  const options = { clientSecret: secret };

  return (
    <div style={{ width: "100%" }}>
      <div id="checkout">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}

export default CheckoutForm;
