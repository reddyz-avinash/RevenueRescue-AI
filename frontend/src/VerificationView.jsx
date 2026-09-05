// ============================================================
// VerificationView.jsx
// AI RECOVERY VERIFICATION
// ============================================================

import React from "react";
import "./VerificationView.css";

export default function VerificationView({
  paymentLinkId,
  setPaymentLinkId,
  verifyPayment,
  verificationLoading,
  verificationResult,
  getRazorpayStatus,
  getAgentResult,
  getVerifiedAmount,
  getAmountPaid,
  getAmountRecovered,
  isPaymentVerified,
  formatRupees,
}) {

  const verified = isPaymentVerified();

  const amount =
    Number(getVerifiedAmount() || 0);

  const paid =
    Number(getAmountPaid() || 0);

  const recovered =
    Number(getAmountRecovered() || 0);

  const status =
    String(
      getRazorpayStatus() || "—"
    ).toLowerCase();

  const paymentComplete =
    amount > 0 &&
    paid >= amount;

  return (
    <div className="verification-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="verification-header">

        <div>

          <span className="verification-eyebrow">
            REVENUE CONTROL · VERIFICATION
          </span>

          <h1>
            Recovery Verification
          </h1>

          <p>
            Independently confirm that Razorpay received
            the recovery payment before marking revenue recovered.
          </p>

        </div>

        <div
          className={
            `verification-status ${
              verified
                ? "success"
                : "pending"
            }`
          }
        >
          <span>
            {verified ? "✓" : "●"}
          </span>

          {verified
            ? "RECOVERY VERIFIED"
            : "AWAITING VERIFICATION"}
        </div>

      </div>


      {/* ==================================================
          VERIFICATION CONTROL
          ================================================== */}

      <section className="verification-control card">

        <div className="verification-control-header">

          <div>

            <span>
              GATEWAY VERIFICATION
            </span>

            <h2>
              Verify a Razorpay payment
            </h2>

            <p>
              Enter the Payment Link ID used for the recovery
              intervention. Verification is performed server-side.
            </p>

          </div>

          <div className="verification-shield">
            ✓
          </div>

        </div>


        <div className="verification-input-row">

          <div className="verification-input-wrap">

            <span>
              PLINK
            </span>

            <input
              value={paymentLinkId || ""}
              onChange={e =>
                setPaymentLinkId(
                  e.target.value
                )
              }
              placeholder="plink_..."
              spellCheck="false"
            />

          </div>


          <button
            className="verification-button"
            onClick={verifyPayment}
            disabled={verificationLoading}
          >
            {verificationLoading
              ? "Checking Razorpay..."
              : "Verify Payment"}
          </button>

        </div>


        <div className="verification-security">

          <span>
            i
          </span>

          <div>

            <strong>
              Server-side verification
            </strong>

            <p>
              RevenueRescue queries Razorpay through FastAPI.
              The frontend does not assume a payment was successful.
            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          RESULT
          ================================================== */}

      <section
        className={
          `verification-result card ${
            verified
              ? "verified"
              : ""
          }`
        }
      >

        {!verificationResult ? (

          <div className="verification-empty">

            <div className="verification-empty-icon">
              ?
            </div>

            <span>
              PAYMENT EVIDENCE
            </span>

            <h2>
              No verification result yet
            </h2>

            <p>
              Complete the Razorpay payment first, then run
              verification to retrieve the gateway evidence.
            </p>

          </div>

        ) : (

          <>

            <div className="result-heading">

              <div>

                <span>
                  PAYMENT EVIDENCE
                </span>

                <h2>
                  {verified
                    ? "Revenue recovery confirmed"
                    : "Verification result"}
                </h2>

              </div>

              <span
                className={
                  `result-badge ${
                    verified
                      ? "success"
                      : "warning"
                  }`
                }
              >
                {verified
                  ? "✓ VERIFIED"
                  : "NOT VERIFIED"}
              </span>

            </div>


            {/* ==================================================
                RECOVERED AMOUNT
                ================================================== */}

            <div className="recovered-hero">

              <div>

                <span>
                  AMOUNT RECOVERED
                </span>

                <strong>
                  {formatRupees(
                    recovered
                  )}
                </strong>

              </div>

              <div className="recovery-state">

                <span>
                  {verified
                    ? "FULL RECOVERY"
                    : "RECOVERY PENDING"}
                </span>

                <b>
                  {amount > 0
                    ? `${Math.min(
                        (recovered / amount) * 100,
                        100
                      ).toFixed(0)}%`
                    : "0%"}
                </b>

              </div>

            </div>


            {/* ==================================================
                PAYMENT PROGRESS
                ================================================== */}

            <div className="verification-progress">

              <div className="progress-header">

                <span>
                  Payment completion
                </span>

                <strong>
                  {amount > 0
                    ? `${Math.min(
                        (paid / amount) * 100,
                        100
                      ).toFixed(0)}%`
                    : "0%"}
                </strong>

              </div>

              <div className="progress-track">

                <div
                  className={
                    paymentComplete
                      ? "complete"
                      : ""
                  }
                  style={{
                    width:
                      amount > 0
                        ? `${Math.min(
                            (paid / amount) * 100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

              <div className="progress-values">

                <span>
                  Paid {formatRupees(paid)}
                </span>

                <span>
                  Expected {formatRupees(amount)}
                </span>

              </div>

            </div>


            {/* ==================================================
                EVIDENCE GRID
                ================================================== */}

            <div className="evidence-grid">

              <EvidenceCard
                label="Razorpay status"
                value={
                  getRazorpayStatus()
                }
                success={
                  status === "paid"
                }
              />

              <EvidenceCard
                label="Agent result"
                value={
                  getAgentResult()
                }
                success={
                  recovered > 0
                }
              />

              <EvidenceCard
                label="Amount"
                value={
                  formatRupees(amount)
                }
              />

              <EvidenceCard
                label="Amount paid"
                value={
                  formatRupees(paid)
                }
                success={
                  paymentComplete
                }
              />

            </div>


            {/* ==================================================
                LINK ID
                ================================================== */}

            <div className="verified-link-row">

              <span>
                PAYMENT LINK ID
              </span>

              <strong>
                {paymentLinkId || "—"}
              </strong>

            </div>


            {/* ==================================================
                FINAL MESSAGE
                ================================================== */}

            {verified ? (

              <div className="verification-success-banner">

                <div className="success-icon">
                  ✓
                </div>

                <div>

                  <span>
                    REVENUE RECOVERY CONFIRMED
                  </span>

                  <strong>
                    {formatRupees(recovered)}
                    {" "}successfully recovered
                  </strong>

                  <p>
                    Razorpay reports the payment as fully paid.
                    The recovery workflow can now stop for this case.
                  </p>

                </div>

              </div>

            ) : (

              <div className="verification-warning-banner">

                <div>
                  !
                </div>

                <p>
                  The payment has not yet satisfied the recovery
                  verification condition. Do not count this amount
                  as recovered.
                </p>

              </div>

            )}

          </>

        )}

      </section>


      {/* ==================================================
          VERIFICATION PRINCIPLE
          ================================================== */}

      <section className="verification-principle">

        <div className="principle-step">
          <span>01</span>
          <strong>Payment event</strong>
          <p>Customer completes payment</p>
        </div>

        <div className="principle-arrow">
          →
        </div>

        <div className="principle-step">
          <span>02</span>
          <strong>Razorpay</strong>
          <p>Gateway reports payment state</p>
        </div>

        <div className="principle-arrow">
          →
        </div>

        <div className="principle-step">
          <span>03</span>
          <strong>Verification</strong>
          <p>Backend confirms evidence</p>
        </div>

        <div className="principle-arrow">
          →
        </div>

        <div className="principle-step">
          <span>04</span>
          <strong>Recovered</strong>
          <p>Revenue is counted</p>
        </div>

      </section>

    </div>
  );
}


/* ============================================================
   EVIDENCE CARD
   ============================================================ */

function EvidenceCard({
  label,
  value,
  success,
}) {
  return (
    <div
      className={
        `evidence-card ${
          success
            ? "success"
            : ""
        }`
      }
    >
      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>
    </div>
  );
}