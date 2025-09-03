import React, { useState, useRef, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import styles from "./StripeWrapper.module.css";
import { MyCareerGuidanceButton } from "../../commonComponents";
import { API_URL } from "../../../utils/constants";
import { postApiWithAuth } from "../../../utils/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSubscribe } from "../../../context/subscribe";

function CheckoutForm() {
  const navigate = useNavigate();
  const { setSubscribe } = useSubscribe();
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");

  const handlePaymentSubmit = async (paymentMethod) => {
    try {
      // Extract useful info from payment method for better UX
      const cardInfo = paymentMethod.card;
      const cardBrand = cardInfo?.brand?.toUpperCase() || 'CARD';
      const last4 = cardInfo?.last4 || '';
      
      const response = await postApiWithAuth(API_URL.CREATEPAYMENT, {
        payment_method_id: paymentMethod.id,
        // Optionally send additional payment info to backend
        card_brand: cardInfo?.brand,
        card_last4: cardInfo?.last4,
        card_country: cardInfo?.country,
        cardholder_name: paymentMethod.billing_details?.name || nameOnCard,
      });
      
      // Debug log to check response structure
      console.log("API Response:", response.data);
      
      // Check different possible response structures
      const responseData = response.data?.data || response.data;
      
      if (responseData?.success) {
        setSubscribe(true);
        message.success(
          responseData.message || 
          `Payment successful with ${cardBrand} ending in ${last4}!`
        );
        setIsLoading(false);
        navigate("/dashboard");
      } else {
        setIsLoading(false);
        message.error(responseData?.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Payment error:", error);
      message.error("Payment failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      message.error("Payment system not ready. Please refresh and try again.");
      return;
    }

    // Get the card element correctly
    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      setIsLoading(false);
      message.error("Card information not found. Please refresh and try again.");
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: nameOnCard,
        },
      });

      if (stripeError) {
        setIsLoading(false);
        // Enhanced error messages based on Stripe error types
        let errorMessage = stripeError.message;
        
        if (stripeError.code === 'card_declined') {
          errorMessage = "Your card was declined. Please try a different payment method.";
        } else if (stripeError.code === 'expired_card') {
          errorMessage = "Your card has expired. Please use a different card.";
        } else if (stripeError.code === 'incorrect_cvc') {
          errorMessage = "Your card's security code is incorrect.";
        }
        
        message.error(errorMessage);
      } else {
        // Validate card details before processing
        if (paymentMethod?.card?.country && paymentMethod.card.country !== 'PK') {
          // Optional: Add country validation if needed
          console.log(`Card issued in: ${paymentMethod.card.country}`);
        }
        
        // Log payment method details for debugging
        console.log("Payment Method Created:", {
          id: paymentMethod.id,
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          country: paymentMethod.card?.country
        });
        
        // Now call handlePaymentSubmit
        await handlePaymentSubmit(paymentMethod);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Stripe error:", error);
      message.error("Payment processing failed. Please try again.");
    }
  };

  const handleNameInputChange = (e) => {
    const inputValue = e.target.value.trimStart();
    const regex = /^[a-zA-Z\s]*$/;

    if (regex.test(inputValue)) {
      setNameOnCard(inputValue);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <div className={`${styles.cardNameInputContainer} mt-5`}>
          <input
            className={`${styles.cardNameInput}`}
            placeholder="Name on card"
            value={nameOnCard}
            onChange={handleNameInputChange}
            disabled={isLoading}
          />
        </div>
        <div className="mt-5">
          <CardNumberElement
            className={`${styles.inputContainer} `}
            options={{
              disabled: isLoading,
              style: {
                base: {
                  color: "#49454f",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  letterSpacing: "0.5px",
                  padding: "8px 0px 8px 16px",
                  "::placeholder": {
                    color: "#49454f80",
                  },
                },
              },
            }}
          />
        </div>
        <div className="flex">
          <div className="mt-5 w-full mr-2">
            <CardExpiryElement
              className={`${styles.inputContainer}`}
              options={{
                disabled: isLoading,
                style: {
                  base: {
                    color: "#49454f",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    letterSpacing: "0.5px",
                    padding: "8px 0px 8px 16px",
                    "::placeholder": {
                      color: "#49454f80",
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-5 w-full ml-2">
            <div>
              <CardCvcElement
                className={`${styles.inputContainer} `}
                options={{
                  disabled: isLoading,
                  style: {
                    base: {
                      color: "#49454f",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      letterSpacing: "0.5px",
                      padding: "8px 0px 8px 16px",
                      "::placeholder": {
                        color: "#49454f80",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <MyCareerGuidanceButton
          label="Checkout"
          className="signInButton"
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading || !stripe || !elements}
        />
      </form>
    </div>
  );
}

export default CheckoutForm;