// ============================================================
// PaymentView.jsx
// RAZORPAY PAYMENT EXECUTION PAGE
// ============================================================

import React from "react";
import "./Payment.css";

const DEMO_PAYMENT_URL = "https://rzp.io/rzp/Gss3ZP6c";

export default function PaymentView({
  paymentLinkId,
  getPaymentUrl,
}) {

  // Try the URL coming from the backend first.
  // If unavailable, use the working Razorpay Test Mode link.
  const backendPaymentUrl =
    typeof getPaymentUrl === "function"
      ? getPaymentUrl()
      : "";

  const paymentUrl =
    backendPaymentUrl || DEMO_PAYMENT_URL;


  const openPaymentLink = () => {

    if (!paymentUrl) {
      return;
    }

    window.open(
      paymentUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  return (
    <div className="razorpay-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="rzp-page-header">

        <div>

          <span className="rzp-eyebrow">
            PAYMENT EXECUTION · RAZORPAY
          </span>

          <h1>
            Razorpay Payment
          </h1>

          <p>
            Execute the AI-selected recovery action through
            Razorpay Test Mode.
          </p>

        </div>

        <div className="rzp-header-badges">

          <span className="rzp-test-badge">
            RAZORPAY TEST MODE
          </span>

          <span className="rzp-connected-badge">
            <i />
            PAYMENT READY
          </span>

        </div>

      </div>


      {/* ==================================================
          MAIN PAYMENT CARD
          ================================================== */}

      <section className="rzp-payment-card">

        <div className="rzp-payment-top">

          <div className="rzp-logo-box">
            R
          </div>

          <div>

            <span className="rzp-card-kicker">
              RECOVERY PAYMENT
            </span>

            <h2>
              Customer payment link
            </h2>

            <p>
              The recovery agent selected a customer-initiated
              payment link as the safest intervention.
            </p>

          </div>

        </div>


        {/* ==================================================
            PAYMENT LINK
            ================================================== */}

        <div className="rzp-link-box">

          <div className="rzp-link-label">

            <span>
              PAYMENT LINK
            </span>

            <span className="rzp-ready">
              ● READY
            </span>

          </div>


          <div className="rzp-link-content">

            <code>
              {paymentUrl}
            </code>

            <button
              type="button"
              className="rzp-open-button"
              onClick={openPaymentLink}
            >
              Open Payment
              <span>↗</span>
            </button>

          </div>

        </div>


        {/* ==================================================
            DETAILS
            ================================================== */}

        <div className="rzp-details-grid">

          <div className="rzp-detail">

            <span>
              PAYMENT LINK ID
            </span>

            <strong>
              {paymentLinkId || "Demo Test Link"}
            </strong>

          </div>


          <div className="rzp-detail">

            <span>
              ENVIRONMENT
            </span>

            <strong>
              Test Mode
            </strong>

          </div>


          <div className="rzp-detail">

            <span>
              EXECUTION TYPE
            </span>

            <strong>
              Customer Initiated
            </strong>

          </div>


          <div className="rzp-detail">

            <span>
              RECOVERY METHOD
            </span>

            <strong>
              Payment Link
            </strong>

          </div>

        </div>


        {/* ==================================================
            PRIMARY ACTION
            ================================================== */}

        <div className="rzp-primary-action">

          <div>

            <span className="rzp-action-title">
              READY FOR CUSTOMER PAYMENT
            </span>

            <p>
              Open the Razorpay payment page to simulate
              the customer completing the recovery payment.
            </p>

          </div>


          <button
            type="button"
            className="rzp-main-button"
            onClick={openPaymentLink}
          >
            Open Razorpay Payment
            <span>↗</span>
          </button>

        </div>

      </section>


      {/* ==================================================
          EXECUTION FLOW
          ================================================== */}

      <section className="rzp-execution-section">

        <div className="rzp-section-heading">

          <div>

            <span>
              PAYMENT EXECUTION
            </span>

            <h2>
              Recovery execution flow
            </h2>

          </div>

        </div>


        <div className="rzp-flow">

          <div className="rzp-flow-step complete">

            <div className="rzp-step-number">
              ✓
            </div>

            <div>

              <strong>
                AI decision
              </strong>

              <p>
                Recovery action selected
              </p>

            </div>

          </div>


          <div className="rzp-flow-line" />


          <div className="rzp-flow-step complete">

            <div className="rzp-step-number">
              ✓
            </div>

            <div>

              <strong>
                Payment link
              </strong>

              <p>
                Razorpay recovery path ready
              </p>

            </div>

          </div>


          <div className="rzp-flow-line" />


          <div className="rzp-flow-step active">

            <div className="rzp-step-number">
              03
            </div>

            <div>

              <strong>
                Customer pays
              </strong>

              <p>
                Complete the Test Mode payment
              </p>

            </div>

          </div>


          <div className="rzp-flow-line" />


          <div className="rzp-flow-step">

            <div className="rzp-step-number">
              04
            </div>

            <div>

              <strong>
                Verification
              </strong>

              <p>
                Confirm payment with Razorpay
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          TEST MODE NOTE
          ================================================== */}

      <section className="rzp-test-note">

        <div className="rzp-note-icon">
          i
        </div>

        <div>

          <strong>
            Test Mode payment
          </strong>

          <p>
            This flow uses Razorpay Test Mode. No real money
            is transferred. After completing the payment,
            use the Verification page to confirm the result.
          </p>

        </div>

      </section>

    </div>
  );
}