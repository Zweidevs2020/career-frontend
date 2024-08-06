import React, { useState, useRef, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import styles from "./StripeWrapper.module.css";
import {
  MyCareerGuidanceButton,
} from "../../commonComponents";


function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");

  const handlePaymentSubmit = async (payment) => {
    setIsLoading(true);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    let cardElement = null;
    cardElement = { ...elements.getElement(CardCvcElement) };
    cardElement = { ...cardElement, ...elements.getElement(CardExpiryElement) };
    cardElement = { ...cardElement, ...elements.getElement(CardNumberElement) };

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        metadata: {
          cardholder: nameOnCard,
        },
      });
    handlePaymentSubmit({
      payment_method: paymentMethod.id,
    });

    if (stripeError) {
      return;
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
    <div  style={{width:'100%' }}>
      <form onSubmit={handleSubmit}>
        <div className={`${styles.cardNameInputContainer} mt-5`}>
          <input
            className={`${styles.cardNameInput}`}
            placeholder="Name on card"
            value={nameOnCard}
            onChange={handleNameInputChange}
          />
        </div>
        <div className="mt-5">
          <CardNumberElement
            className={`${styles.inputContainer} `}
            options={{
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
          />
      </form>
    </div>
  );
}

export default CheckoutForm;
