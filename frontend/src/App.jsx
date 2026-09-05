import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Dashboard from "./Dashboard";
import RecoveryFunnelView from "./RecoveryFunnelView";
import AnalyticsView from "./AnalyticsView";
import PaymentView from "./PaymentView";
import VerificationView from "./VerificationView";
import AuditView from "./AuditView";
import HumanReviewView from "./HumanReviewView";
import GuardrailsView from "./GuardrailsView";

const API = "http://127.0.0.1:8000";

const DEMO_PAYMENT_LINK =
  "plink_TVu478q6sZzwhq";


function App() {

  // ============================================================
  // STATE
  // ============================================================

  const [metrics, setMetrics] = useState(null);

  const [transactions, setTransactions] =
    useState([]);

  const [auditRecords, setAuditRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeView, setActiveView] =
    useState("overview");

  const [recoveryLoading, setRecoveryLoading] =
    useState(false);

  const [recoveryResult, setRecoveryResult] =
    useState(null);

  const [verificationLoading, setVerificationLoading] =
    useState(false);

  const [verificationResult, setVerificationResult] =
    useState(null);

  const [paymentLinkId, setPaymentLinkId] =
    useState(DEMO_PAYMENT_LINK);

  const [form, setForm] = useState({
    amount: 500,
    failure_reason: "temporary_failure",
    previous_successes: 10,
    previous_failures: 0,
    customer_tenure_months: 18,
  });


  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  async function loadDashboard() {

    try {

      setError("");

      const [
        metricsResponse,
        transactionsResponse,
        auditResponse,
      ] = await Promise.all([
        fetch(`${API}/metrics`),
        fetch(`${API}/transactions`),
        fetch(`${API}/audit`),
      ]);


      if (
        !metricsResponse.ok ||
        !transactionsResponse.ok ||
        !auditResponse.ok
      ) {

        throw new Error(
          "Backend API is not responding. Start FastAPI on port 8000."
        );

      }


      const metricsData =
        await metricsResponse.json();

      const transactionsData =
        await transactionsResponse.json();

      const auditData =
        await auditResponse.json();


      setMetrics(metricsData);

      setTransactions(
        transactionsData.transactions || []
      );

      setAuditRecords(
        auditData.audit || []
      );


    } catch (err) {

      console.error(
        "Dashboard loading error:",
        err
      );

      let message =
        "Unable to load dashboard data.";

      if (err?.message) {

        message =
          String(err.message);

      } else if (
        typeof err === "string"
      ) {

        message =
          err;

      } else if (
        err &&
        typeof err === "object"
      ) {

        message =
          err.detail ||
          err.message ||
          JSON.stringify(err);

      }

      setError(message);

    } finally {

      setLoading(false);

    }

  }


  // ============================================================
  // INITIAL LOAD + AUTO REFRESH
  // ============================================================

  useEffect(() => {

    loadDashboard();

    const interval =
      setInterval(
        loadDashboard,
        10000
      );

    return () =>
      clearInterval(interval);

  }, []);


  // ============================================================
  // FORMATTERS
  // ============================================================

  function formatRupees(value) {

    const number =
      Number(value || 0);

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(number);

  }


  function formatCompactRupees(value) {

    const number =
      Number(value || 0);


    if (number >= 10000000) {

      return `₹${(
        number / 10000000
      ).toFixed(2)}Cr`;

    }


    if (number >= 100000) {

      return `₹${(
        number / 100000
      ).toFixed(2)}L`;

    }


    if (number >= 1000) {

      return `₹${(
        number / 1000
      ).toFixed(1)}K`;

    }


    return formatRupees(number);
  }


  function formatPercent(value) {

    return `${Number(
      value || 0
    ).toFixed(1)}%`;

  }


  // ============================================================
  // FORM
  // ============================================================

  function updateForm(
    field,
    value
  ) {

    setForm(
      previous => ({
        ...previous,
        [field]: value,
      })
    );

  }


  // ============================================================
  // AI RECOVERY AGENT
  // ============================================================

  async function analyzeRecovery() {

    try {

      setRecoveryLoading(true);

      setRecoveryResult(null);

      setError("");


      const payload = {

        transaction_id:
          `DASHBOARD_${Date.now()}`,

        customer_id:
          "CUST_DASHBOARD_001",

        amount:
          Number(form.amount),

        failure_reason:
          form.failure_reason,

        retry_count:
          0,

        previous_successes:
          Number(
            form.previous_successes
          ),

        previous_failures:
          Number(
            form.previous_failures
          ),

        previous_recovery_success:
          0,

        customer_name:
          "RevenueRescue Demo Customer",

        customer_email:
          "test@example.com",

        customer_phone:
          "9876543210",

        checkout_duration_minutes:
          4,

        checkout_started:
          1,

        checkout_completed:
          0,

        customer_tenure_months:
          Number(
            form.customer_tenure_months
          ),

        subscription_active:
          1,

        days_overdue:
          0,

        days_since_last_payment:
          25,
      };


      const response =
        await fetch(
          `${API}/recover`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );


      if (!response.ok) {

        const data =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          data?.detail ||
          "Recovery request failed."
        );

      }


      const data =
        await response.json();


      setRecoveryResult(
        data.result
      );


      await loadDashboard();


    } catch (err) {

      console.error(
        "Recovery error:",
        err
      );

      setError(
        err?.message ||
        "Recovery analysis failed."
      );


    } finally {

      setRecoveryLoading(false);

    }

  }


  // ============================================================
  // PAYMENT VERIFICATION
  // ============================================================

  async function verifyPayment() {

    if (
      !paymentLinkId ||
      !paymentLinkId.trim()
    ) {

      setError(
        "Enter a Razorpay Payment Link ID."
      );

      return;
    }


    try {

      setVerificationLoading(true);

      setVerificationResult(null);

      setError("");


      const cleanPaymentLinkId =
        paymentLinkId.trim();


      const response =
        await fetch(
          `${API}/verify/${encodeURIComponent(
            cleanPaymentLinkId
          )}`
        );


      if (!response.ok) {

        const data =
          await response
            .json()
            .catch(() => null);


        let errorMessage =
          "Payment verification failed.";


        if (
          typeof data?.detail ===
          "string"
        ) {

          errorMessage =
            data.detail;

        } else if (
          data?.detail &&
          typeof data.detail ===
          "object"
        ) {

          errorMessage =
            data.detail.message ||
            data.detail.error ||
            JSON.stringify(
              data.detail
            );

        }


        throw new Error(
          errorMessage
        );

      }


      const data =
        await response.json();


      console.log(
        "Verification:",
        data
      );


      setVerificationResult(
        data.result
      );


      /*
       * IMPORTANT:
       * Reload metrics, transactions and audit
       * after successful verification.
       *
       * The backend /verify endpoint now updates
       * recovery_audit.csv when Razorpay confirms
       * a recovered payment.
       */

      await loadDashboard();


    } catch (err) {

      console.error(
        "Payment verification error:",
        err
      );


      let message =
        "Payment verification failed.";


      if (err?.message) {

        message =
          String(err.message);

      } else if (
        typeof err === "string"
      ) {

        message =
          err;

      } else if (
        err &&
        typeof err === "object"
      ) {

        message =
          err.detail ||
          err.message ||
          JSON.stringify(err);

      }


      setError(message);


    } finally {

      setVerificationLoading(false);

    }

  }


  // ============================================================
  // RECOVERY RESULT HELPERS
  // ============================================================

  function getProbability() {

    if (!recoveryResult) {
      return 0;
    }


    const value =
      recoveryResult.recovery_probability ??
      recoveryResult.prediction ??
      recoveryResult.probability ??
      recoveryResult.result?.prediction ??
      0;


    let probability =
      Number(value);


    if (probability > 1) {

      probability =
        probability / 100;

    }


    return Math.min(
      Math.max(
        probability,
        0
      ),
      1
    );

  }


  function getDiagnosis() {

    if (!recoveryResult) {
      return "—";
    }


    const diagnosis =
      recoveryResult.diagnosis ??
      recoveryResult.result?.diagnosis ??
      {};


    if (
      typeof diagnosis ===
      "string"
    ) {

      return diagnosis;

    }


    return (
      diagnosis.cause ||
      "No diagnosis"
    );

  }


  function getStrategy() {

    if (!recoveryResult) {
      return "—";
    }


    const diagnosis =
      recoveryResult.diagnosis ??
      recoveryResult.result?.diagnosis ??
      {};


    if (
      typeof diagnosis ===
      "string"
    ) {

      return diagnosis;

    }


    return (
      recoveryResult.recommended_strategy ??
      diagnosis.recommended_strategy ??
      "—"
    );

  }


  function getAction() {

    if (!recoveryResult) {
      return "—";
    }


    const decision =
      recoveryResult.decision ??
      recoveryResult.result?.decision ??
      {};


    if (
      typeof decision ===
      "string"
    ) {

      return decision;

    }


    return (
      recoveryResult.selected_action ??
      decision.action ??
      "—"
    );

  }


  function getRisk() {

    if (!recoveryResult) {
      return "—";
    }


    const decision =
      recoveryResult.decision ??
      recoveryResult.result?.decision ??
      {};


    if (
      typeof decision ===
      "string"
    ) {

      return decision;

    }


    return (
      recoveryResult.risk_level ??
      decision.risk_level ??
      "—"
    );

  }


  function getReason() {

    if (!recoveryResult) {
      return "—";
    }


    const decision =
      recoveryResult.decision ??
      recoveryResult.result?.decision ??
      {};


    if (
      typeof decision ===
      "string"
    ) {

      return decision;

    }


    return (
      recoveryResult.decision_reason ??
      decision.reason ??
      "No decision reason available."
    );

  }


  function getResultStatus() {

    if (!recoveryResult) {
      return "pending";
    }


    const result =
      recoveryResult.result ??
      {};


    return (
      recoveryResult.result_status ??
      result.status ??
      recoveryResult.status ??
      "pending"
    );

  }


  function getPaymentUrl() {

    if (!recoveryResult) {
      return null;
    }


    const result =
      recoveryResult.result ??
      {};


    const directUrl =
      recoveryResult.payment_url ??
      result.payment_url ??
      null;


    if (
      typeof directUrl !==
      "string"
    ) {

      return null;

    }


    const cleanedUrl =
      directUrl.trim();


    if (!cleanedUrl) {
      return null;
    }


    return /^https?:\/\//i.test(
      cleanedUrl
    )
      ? cleanedUrl
      : null;

  }


  // ============================================================
  // VERIFICATION HELPERS
  // ============================================================

  function getVerifiedAmount() {

    if (!verificationResult) {
      return 0;
    }


    return Number(
      verificationResult.amount ||
      verificationResult.amount_paise /
        100 ||
      0
    );

  }


  function getAmountPaid() {

    if (!verificationResult) {
      return 0;
    }


    return Number(
      verificationResult.amount_paid ||
      verificationResult.paid_amount ||
      verificationResult.amount_paid_paise /
        100 ||
      0
    );

  }


  function getAmountRecovered() {

    if (!verificationResult) {
      return 0;
    }


    return Number(
      verificationResult.amount_recovered ||
      verificationResult.recovered_amount ||
      verificationResult.recovered_amount_paise /
        100 ||
      0
    );

  }


  function getRazorpayStatus() {

    if (!verificationResult) {
      return "—";
    }


    const amount =
      getVerifiedAmount();

    const paid =
      getAmountPaid();


    if (
      amount > 0 &&
      paid >= amount
    ) {

      return "paid";

    }


    return String(
      verificationResult.payment_link_status ??
      verificationResult.razorpay_status ??
      verificationResult.payment_status ??
      verificationResult.status ??
      "—"
    );

  }


  function getAgentResult() {

    if (!verificationResult) {
      return "—";
    }


    const recovered =
      getAmountRecovered();


    if (recovered > 0) {
      return "recovered";
    }


    return String(
      verificationResult.agent_result ??
      verificationResult.result_status ??
      verificationResult.agent_status ??
      "—"
    );

  }


  function isPaymentVerified() {

    if (!verificationResult) {
      return false;
    }


    const amount =
      getVerifiedAmount();

    const paid =
      getAmountPaid();

    const recovered =
      getAmountRecovered();


    return (
      amount > 0 &&
      paid >= amount &&
      recovered >= amount
    );

  }


  // ============================================================
  // ANALYTICS
  // ============================================================

  const outcomeData = useMemo(
    () => [

      {
        label: "Recovered",
        value:
          Number(
            metrics?.recovered || 0
          ),
        className: "green",
      },

      {
        label: "Pending",
        value:
          Number(
            metrics?.pending || 0
          ),
        className: "amber",
      },

      {
        label: "Escalated",
        value:
          Number(
            metrics?.escalated || 0
          ),
        className: "purple",
      },

      {
        label: "Stopped",
        value:
          Number(
            metrics?.stopped || 0
          ),
        className: "slate",
      },

      {
        label: "Failed",
        value:
          Number(
            metrics?.failed || 0
          ),
        className: "red",
      },

    ],
    [metrics]
  );


  const maxOutcome =
    Math.max(
      ...outcomeData.map(
        item =>
          Number(item.value)
      ),
      1
    );


  const failureDistribution =
    useMemo(() => {

      const counts = {};


      auditRecords.forEach(
        record => {

          const diagnosis =
            record.diagnosis ||
            "Unknown";


          counts[diagnosis] =
            (
              counts[diagnosis] ||
              0
            ) + 1;

        }
      );


      return Object.entries(
        counts
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .slice(
          0,
          6
        );

    }, [auditRecords]);


  const strategyDistribution =
    useMemo(() => {

      const counts = {};


      auditRecords.forEach(
        record => {

          const strategy =
            record.recommended_strategy ||
            "Unknown";


          counts[strategy] =
            (
              counts[strategy] ||
              0
            ) + 1;

        }
      );


      return Object.entries(
        counts
      ).sort(
        (a, b) =>
          b[1] - a[1]
      );

    }, [auditRecords]);


  // ============================================================
  // STATUS CLASS
  // ============================================================

  function statusClass(status) {

    const value =
      String(
        status || ""
      ).toLowerCase();


    if (
      value.includes("recover") ||
      value.includes("success")
    ) {

      return "status-recovered";

    }


    if (
      value.includes("fail")
    ) {

      return "status-failed";

    }


    if (
      value.includes("escal")
    ) {

      return "status-escalated";

    }


    if (
      value.includes("stop")
    ) {

      return "status-stopped";

    }


    return "status-pending";

  }


  // ============================================================
  // CURRENT PAGE NAME
  // ============================================================

  function getPageName() {

    const pages = {

      overview:
        "Overview",

      recovery:
        "AI Recovery",

      analytics:
        "Analytics",

      funnel:
        "Recovery Funnel",

      payments:
        "Razorpay",

      verification:
        "Verification",

      human:
        "Human Review",

      audit:
        "Audit Trail",

      guardrails:
        "Guardrails",

    };


    return (
      pages[activeView] ||
      "Overview"
    );

  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="app">


      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="logo-mark">
            R
          </div>

          <div>

            <strong>
              RevenueRescue
            </strong>

            <span>
              AI Revenue Operations
            </span>

          </div>

        </div>


        {/* COMMAND CENTER */}

        <div className="sidebar-section">

          <span className="sidebar-heading">
            COMMAND CENTER
          </span>


          <NavItem
            icon="⌂"
            label="Overview"
            active={
              activeView ===
              "overview"
            }
            onClick={() =>
              setActiveView(
                "overview"
              )
            }
          />


          <NavItem
            icon="✦"
            label="AI Recovery"
            active={
              activeView ===
              "recovery"
            }
            onClick={() =>
              setActiveView(
                "recovery"
              )
            }
          />

        </div>


        {/* INTELLIGENCE */}

        <div className="sidebar-section">

          <span className="sidebar-heading">
            INTELLIGENCE
          </span>


          <NavItem
            icon="◒"
            label="Analytics"
            active={
              activeView ===
              "analytics"
            }
            onClick={() =>
              setActiveView(
                "analytics"
              )
            }
          />


          <NavItem
            icon="◇"
            label="Recovery Funnel"
            active={
              activeView ===
              "funnel"
            }
            onClick={() =>
              setActiveView(
                "funnel"
              )
            }
          />

        </div>


        {/* PAYMENTS */}

        <div className="sidebar-section">

          <span className="sidebar-heading">
            PAYMENTS
          </span>


          <NavItem
            icon="₹"
            label="Razorpay"
            active={
              activeView ===
              "payments"
            }
            onClick={() =>
              setActiveView(
                "payments"
              )
            }
          />


          <NavItem
            icon="✓"
            label="Verification"
            active={
              activeView ===
              "verification"
            }
            onClick={() =>
              setActiveView(
                "verification"
              )
            }
          />

        </div>


        {/* OPERATIONS */}

        <div className="sidebar-section">

          <span className="sidebar-heading">
            OPERATIONS
          </span>


          <NavItem
            icon="⚑"
            label="Human Review"
            active={
              activeView ===
              "human"
            }
            onClick={() =>
              setActiveView(
                "human"
              )
            }
          />


          <NavItem
            icon="▤"
            label="Audit Trail"
            active={
              activeView ===
              "audit"
            }
            onClick={() =>
              setActiveView(
                "audit"
              )
            }
          />


          <NavItem
            icon="⚙"
            label="Guardrails"
            active={
              activeView ===
              "guardrails"
            }
            onClick={() =>
              setActiveView(
                "guardrails"
              )
            }
          />

        </div>


        {/* ENVIRONMENT */}

        <div className="sidebar-bottom">

          <div className="environment-card">

            <div className="environment-dot"></div>

            <div>

              <strong>
                Test Environment
              </strong>

              <span>
                Razorpay sandbox
              </span>

            </div>

          </div>

        </div>

      </aside>


      {/* ======================================================
          MAIN AREA
          ====================================================== */}

      <div className="main-area">


        {/* TOPBAR */}

        <header className="topbar">

          <div className="breadcrumb">

            <span>
              RevenueRescue AI
            </span>

            <b>
              /
            </b>

            <strong>
              {getPageName()}
            </strong>

          </div>


          <div className="topbar-actions">

            <button
              className="icon-button"
              onClick={
                loadDashboard
              }
              title="Refresh dashboard"
            >
              ↻
            </button>


            <div className="system-pill">

              <span></span>

              System operational

            </div>

          </div>

        </header>


        {/* ====================================================
            PAGE CONTENT
            ==================================================== */}

        <main className="dashboard">


          {/* GLOBAL ERROR */}

          {error && (

            <div className="error-banner">

              <span>
                !
              </span>

              <div>
                {error}
              </div>

              <button
                onClick={() =>
                  setError("")
                }
              >
                ×
              </button>

            </div>

          )}


          {/* ==================================================
              OVERVIEW
              ================================================== */}

          {activeView ===
            "overview" && (

            <Dashboard
              metrics={
                metrics
              }

              auditRecords={
                auditRecords
              }

              transactions={
                transactions
              }
            />

          )}


          {/* ==================================================
              AI RECOVERY
              ================================================== */}

          {activeView ===
            "recovery" && (

            <RecoveryView

              form={
                form
              }

              updateForm={
                updateForm
              }

              analyzeRecovery={
                analyzeRecovery
              }

              recoveryLoading={
                recoveryLoading
              }

              recoveryResult={
                recoveryResult
              }

              getProbability={
                getProbability
              }

              getDiagnosis={
                getDiagnosis
              }

              getStrategy={
                getStrategy
              }

              getAction={
                getAction
              }

              getRisk={
                getRisk
              }

              getReason={
                getReason
              }

              getResultStatus={
                getResultStatus
              }

              getPaymentUrl={
                getPaymentUrl
              }

            />

          )}


          {/* ==================================================
              ANALYTICS
              ================================================== */}

          {activeView ===
            "analytics" && (

            <AnalyticsView

              metrics={
                metrics
              }

              auditRecords={
                auditRecords
              }

              outcomeData={
                outcomeData
              }

              maxOutcome={
                maxOutcome
              }

              failureDistribution={
                failureDistribution
              }

              strategyDistribution={
                strategyDistribution
              }

              formatRupees={
                formatRupees
              }

            />

          )}


          {/* ==================================================
              RECOVERY FUNNEL
              ================================================== */}

          {activeView ===
            "funnel" && (

            <RecoveryFunnelView

              metrics={
                metrics
              }

              auditRecords={
                auditRecords
              }

              transactions={
                transactions
              }

            />

          )}


          {/* ==================================================
              RAZORPAY
              PAYMENT EXECUTION ONLY
              ================================================== */}

          {activeView ===
            "payments" && (

            <PaymentView

              paymentLinkId={
                paymentLinkId
              }

              getPaymentUrl={
                getPaymentUrl
              }

            />

          )}


          {/* ==================================================
              VERIFICATION
              VERIFICATION ONLY
              ================================================== */}

          {activeView ===
            "verification" && (

            <VerificationView

              paymentLinkId={
                paymentLinkId
              }

              setPaymentLinkId={
                setPaymentLinkId
              }

              verifyPayment={
                verifyPayment
              }

              verificationLoading={
                verificationLoading
              }

              verificationResult={
                verificationResult
              }

              getRazorpayStatus={
                getRazorpayStatus
              }

              getAgentResult={
                getAgentResult
              }

              getVerifiedAmount={
                getVerifiedAmount
              }

              getAmountPaid={
                getAmountPaid
              }

              getAmountRecovered={
                getAmountRecovered
              }

              isPaymentVerified={
                isPaymentVerified
              }

              formatRupees={
                formatRupees
              }

            />

          )}


          {/* ==================================================
              HUMAN REVIEW
              ================================================== */}

          {activeView ===
            "human" && (

            <HumanReviewView

              auditRecords={
                auditRecords
              }

              transactions={
                transactions
              }

              metrics={
                metrics
              }

            />

          )}


          {/* ==================================================
              AUDIT TRAIL
              ================================================== */}

          {activeView ===
            "audit" && (

            <AuditView

              auditRecords={
                auditRecords
              }

              formatRupees={
                formatRupees
              }

              statusClass={
                statusClass
              }

            />

          )}


          {/* ==================================================
              GUARDRAILS
              ================================================== */}

          {activeView ===
            "guardrails" && (

            <GuardrailsView

              metrics={
                metrics
              }

              auditRecords={
                auditRecords
              }

            />

          )}

        </main>

      </div>

    </div>
  );
}


// ============================================================
// NAV ITEM
// ============================================================

function NavItem({
  icon,
  label,
  active,
  onClick,
}) {

  return (

    <button
      className={
        `nav-item ${
          active
            ? "active"
            : ""
        }`
      }

      onClick={
        onClick
      }
    >

      <span className="nav-icon">
        {icon}
      </span>

      <span>
        {label}
      </span>

      {active && (

        <span
          className="nav-active-line"
        />

      )}

    </button>
  );
}


// ============================================================
// PAGE HEADER
// ============================================================

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}) {

  return (

    <div className="page-header">

      <div>

        <span className="page-eyebrow">
          {eyebrow}
        </span>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

      </div>


      {action}

    </div>
  );
}


// ============================================================
// AI RECOVERY VIEW
// ============================================================

function RecoveryView({
  form,
  updateForm,
  analyzeRecovery,
  recoveryLoading,
  recoveryResult,
  getProbability,
  getDiagnosis,
  getStrategy,
  getAction,
  getRisk,
  getReason,
  getResultStatus,
  getPaymentUrl,
}) {

  const probability =
    getProbability();

  const risk =
    String(
      getRisk() || ""
    ).toLowerCase();

  const status =
    String(
      getResultStatus() ||
      "pending"
    ).toLowerCase();

  const hasResult =
    Boolean(
      recoveryResult
    );

  const paymentUrl =
    getPaymentUrl();


  const handleOpenRecoveryLink =
    (event) => {

      if (!paymentUrl) {

        event.preventDefault();

        return;

      }


      window.open(
        paymentUrl,
        "_blank",
        "noopener,noreferrer"
      );

      event.preventDefault();

    };


  const stageState =
    (stage) => {

      if (!hasResult) {

        return stage ===
          "detect"
          ? "complete"
          : "";

      }


      if (
        stage === "detect" ||
        stage === "diagnose" ||
        stage === "decide" ||
        stage === "act"
      ) {

        return "complete";

      }


      if (
        stage === "verify"
      ) {

        return (
          status ===
            "recovered" ||
          status ===
            "success"
        )
          ? "complete"
          : "";

      }


      return "";

    };


  const riskClass =
    risk.includes("high")
      ? "high"
      : risk.includes("medium")
        ? "medium"
        : "";


  const probabilityLabel =
    probability >= 0.8
      ? "High recovery likelihood"
      : probability >= 0.4
        ? "Moderate recovery likelihood"
        : "Low recovery likelihood";


  return (

    <>

      <PageHeader

        eyebrow="AI RECOVERY"

        title="Agent Playground"

        description="Simulate a revenue-risk event and observe the agent's complete decision path."

        action={

          <div className="recovery-header-actions">

            <span className="mode-badge">
              ● LIVE BACKEND
            </span>

            <span className="mode-badge">
              BOUNDED ACTIONS
            </span>

          </div>

        }

      />


      <div className="playground-grid">


        {/* ==================================================
            FORM
            ================================================== */}

        <section className="playground-form card">

          <div className="card-header">

            <div>

              <h3>
                Transaction context
              </h3>

              <p>
                Signals supplied to the recovery model.
              </p>

            </div>

            <span className="card-badge">
              ML INPUTS
            </span>

          </div>


          <div className="form-content">


            <div className="context-preview">

              <div className="context-icon">
                ₹
              </div>

              <div>

                <strong>
                  Revenue-risk event
                </strong>

                <span>
                  Customer payment requires intervention
                </span>

              </div>

            </div>


            <Field
              label="Transaction amount"
            >

              <div className="currency-input">

                <span>
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  value={
                    form.amount
                  }
                  onChange={
                    e =>
                      updateForm(
                        "amount",
                        e.target.value
                      )
                  }
                />

              </div>

            </Field>


            <Field
              label="Failure reason"
            >

              <select

                value={
                  form.failure_reason
                }

                onChange={
                  e =>
                    updateForm(
                      "failure_reason",
                      e.target.value
                    )
                }

              >

                <option value="temporary_failure">
                  Temporary Failure
                </option>

                <option value="insufficient_funds">
                  Insufficient Funds
                </option>

                <option value="network_error">
                  Network Error
                </option>

                <option value="expired_card">
                  Expired Card
                </option>

                <option value="none">
                  No Specific Failure
                </option>

              </select>

            </Field>


            <div className="form-two">

              <Field
                label="Previous successes"
              >

                <input
                  type="number"
                  min="0"
                  value={
                    form.previous_successes
                  }
                  onChange={
                    e =>
                      updateForm(
                        "previous_successes",
                        e.target.value
                      )
                  }
                />

              </Field>


              <Field
                label="Previous failures"
              >

                <input
                  type="number"
                  min="0"
                  value={
                    form.previous_failures
                  }
                  onChange={
                    e =>
                      updateForm(
                        "previous_failures",
                        e.target.value
                      )
                  }
                />

              </Field>

            </div>


            <Field
              label="Customer tenure"
            >

              <div className="suffix-input">

                <input
                  type="number"
                  min="0"
                  value={
                    form.customer_tenure_months
                  }
                  onChange={
                    e =>
                      updateForm(
                        "customer_tenure_months",
                        e.target.value
                      )
                  }
                />

                <span>
                  months
                </span>

              </div>

            </Field>


            <div className="input-summary">

              <span>
                Decision engine
              </span>

              <strong>
                Probability + policy + risk
              </strong>

            </div>


            <button
              className="primary-button large recovery-run-button"
              onClick={
                analyzeRecovery
              }
              disabled={
                recoveryLoading
              }
            >

              {recoveryLoading ? (

                <>

                  <span className="button-spinner" />

                  Agent is reasoning...

                </>

              ) : (

                <>
                  ✦ Run AI Recovery
                </>

              )}

            </button>


            <p className="form-footnote">

              Test-mode execution only. The agent is restricted by configured recovery guardrails.

            </p>

          </div>

        </section>


        {/* ==================================================
            DECISION
            ================================================== */}

        <section className="agent-decision card">

          {!recoveryResult ? (

            recoveryLoading
              ? <AgentProcessingState />
              : <EmptyAgent />

          ) : (

            <>

              <div className="decision-top">

                <div>

                  <span className="section-kicker">
                    AGENT DECISION
                  </span>

                  <h2>
                    Recovery recommendation
                  </h2>

                </div>

                <span
                  className={
                    `risk-pill ${riskClass}`
                  }
                >
                  {getRisk()}
                </span>

              </div>


              <div className="decision-meta-strip">

                <span>
                  DECISION ENGINE
                </span>

                <strong>
                  RevenueRescue AI
                </strong>

                <b>
                  •
                </b>

                <span>
                  POLICY CHECK
                </span>

                <strong>
                  PASS
                </strong>

              </div>


              <div className="score-layout">

                <ProbabilityGauge
                  probability={
                    probability
                  }
                />


                <div className="score-copy">

                  <span>
                    RECOVERY PROBABILITY
                  </span>

                  <strong>
                    {(
                      probability *
                      100
                    ).toFixed(2)}
                    %
                  </strong>

                  <p>

                    {probabilityLabel}.
                    The model score is combined with
                    deterministic recovery policy before
                    an action is selected.

                  </p>

                </div>

              </div>


              <div className="decision-cards">

                <DecisionCard
                  label="Diagnosis"
                  value={
                    getDiagnosis()
                  }
                  icon="⌁"
                />

                <DecisionCard
                  label="Strategy"
                  value={
                    getStrategy()
                  }
                  icon="◇"
                />

                <DecisionCard
                  label="Selected action"
                  value={
                    getAction()
                  }
                  icon="→"
                />

                <DecisionCard
                  label="Risk level"
                  value={
                    getRisk()
                  }
                  icon="!"
                />

              </div>


              <div className="reason-panel">

                <div className="reason-icon">
                  AI
                </div>

                <div>

                  <span>
                    WHY THE AGENT CHOSE THIS
                  </span>

                  <p>
                    {getReason()}
                  </p>

                </div>

              </div>


              <div className="decision-footer">

                <div>

                  <span>
                    CURRENT STATUS
                  </span>

                  <strong>
                    {getResultStatus()}
                  </strong>

                </div>


                <div className="decision-footer-actions">

                  {paymentUrl && (

                    <button
                      type="button"
                      onClick={
                        handleOpenRecoveryLink
                      }
                      className="secondary-button"
                    >
                      Open recovery link →
                    </button>

                  )}


                  <span
                    className={
                      `result-chip ${
                        statusClassForRecovery(
                          status
                        )
                      }`
                    }
                  >

                    {
                      status ===
                        "recovered" ||
                      status ===
                        "success"
                        ? "✓ Money recovered"
                        : "● Awaiting outcome"
                    }

                  </span>

                </div>

              </div>

            </>

          )}

        </section>

      </div>


      {/* ==================================================
          CLOSED LOOP
          ================================================== */}

      <section className="agent-flow-card card">

        <CardHeader

          title="Closed-loop recovery workflow"

          description="Every intervention follows a measurable, bounded path from risk detection to verified recovery."

          badge={
            hasResult
              ? "EXECUTION TRACE"
              : "READY"
          }

        />


        <div className="workflow enhanced-workflow">

          <WorkflowNode
            number="01"
            title="Detect"
            description="Revenue at risk"
            complete={
              stageState(
                "detect"
              )
            }
          />

          <WorkflowConnector />

          <WorkflowNode
            number="02"
            title="Diagnose"
            description="Failure cause"
            complete={
              stageState(
                "diagnose"
              )
            }
          />

          <WorkflowConnector />

          <WorkflowNode
            number="03"
            title="Decide"
            description="Recovery policy"
            complete={
              stageState(
                "decide"
              )
            }
          />

          <WorkflowConnector />

          <WorkflowNode
            number="04"
            title="Act"
            description="Bounded action"
            complete={
              stageState(
                "act"
              )
            }
          />

          <WorkflowConnector />

          <WorkflowNode
            number="05"
            title="Verify"
            description="Money recovered"
            complete={
              stageState(
                "verify"
              )
            }
          />

        </div>

      </section>


      {/* ==================================================
          EVIDENCE
          ================================================== */}

      <section className="recovery-evidence-grid">

        <EvidenceCard
          icon="01"
          label="MODEL SIGNAL"
          value={
            `${(
              probability *
              100
            ).toFixed(1)}%`
          }
          text="Estimated probability of successful recovery."
        />


        <EvidenceCard
          icon="02"
          label="POLICY ACTION"
          value={
            hasResult
              ? getAction()
              : "Awaiting"
          }
          text="Action selected after diagnosis and risk evaluation."
        />


        <EvidenceCard
          icon="03"
          label="AUDITABILITY"
          value="100%"
          text="Every decision is written to the recovery audit trail."
        />


        <EvidenceCard
          icon="04"
          label="STOP CONDITION"
          value="Verified payment"
          text="Workflow terminates when the recovered amount is confirmed."
        />

      </section>

    </>

  );
}


// ============================================================
// AGENT PROCESSING
// ============================================================

function AgentProcessingState() {

  return (

    <div className="agent-processing">

      <div className="processing-orbit">

        <span />
        <span />
        <span />

      </div>


      <span className="section-kicker">
        AI ENGINE RUNNING
      </span>


      <h2>
        Analyzing revenue risk
      </h2>


      <p>

        The agent is evaluating transaction signals,
        selecting a bounded intervention and preparing
        the execution result.

      </p>


      <div className="processing-steps">

        <span className="processing-step active">
          Detect
        </span>

        <b>
          →
        </b>

        <span className="processing-step active">
          Diagnose
        </span>

        <b>
          →
        </b>

        <span className="processing-step">
          Decide
        </span>

        <b>
          →
        </b>

        <span className="processing-step">
          Act
        </span>

      </div>

    </div>

  );
}


// ============================================================
// EVIDENCE CARD
// ============================================================

function EvidenceCard({
  icon,
  label,
  value,
  text,
}) {

  return (

    <div className="evidence-card card">

      <span className="evidence-icon">
        {icon}
      </span>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <p>
          {text}
        </p>

      </div>

    </div>

  );
}


// ============================================================
// RECOVERY STATUS CLASS
// ============================================================

function statusClassForRecovery(
  status
) {

  if (
    status.includes("recover") ||
    status.includes("success")
  ) {

    return "result-success";

  }


  if (
    status.includes("fail")
  ) {

    return "result-failed";

  }


  if (
    status.includes("escal")
  ) {

    return "result-escalated";

  }


  return "result-pending";

}


// ============================================================
// PROBABILITY GAUGE
// ============================================================

function ProbabilityGauge({
  probability,
}) {

  const radius = 58;

  const circumference =
    2 *
    Math.PI *
    radius;


  const progress =
    Math.min(
      Math.max(
        Number(probability) || 0,
        0
      ),
      1
    );


  return (

    <div className="gauge">

      <svg
        viewBox="0 0 150 150"
      >

        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke="#e9edf3"
          strokeWidth="11"
        />


        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          className="gauge-progress"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            circumference *
            (1 - progress)
          }
          transform="rotate(-90 75 75)"
        />

      </svg>


      <div className="gauge-value">

        <strong>

          {(
            progress *
            100
          ).toFixed(0)}

          %

        </strong>

        <span>
          confidence
        </span>

      </div>

    </div>

  );

}


// ============================================================
// DECISION CARD
// ============================================================

function DecisionCard({
  label,
  value,
  icon,
}) {

  return (

    <div className="decision-card">

      <span className="decision-icon">
        {icon}
      </span>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );

}


// ============================================================
// EMPTY AGENT
// ============================================================

function EmptyAgent() {

  return (

    <div className="empty-agent">

      <div className="empty-agent-icon">
        ✦
      </div>

      <span className="section-kicker">
        READY
      </span>

      <h2>
        Awaiting transaction
      </h2>

      <p>

        Provide a transaction context
        and run the AI recovery engine
        to see the agent's decision.

      </p>


      <div className="mini-flow">

        <span>
          Detect
        </span>

        <b>
          →
        </b>

        <span>
          Diagnose
        </span>

        <b>
          →
        </b>

        <span>
          Recover
        </span>

        <b>
          →
        </b>

        <span>
          Verify
        </span>

      </div>

    </div>

  );

}


// ============================================================
// FIELD
// ============================================================

function Field({
  label,
  children,
}) {

  return (

    <label className="field">

      <span>
        {label}
      </span>

      {children}

    </label>

  );

}


// ============================================================
// WORKFLOW NODE
// ============================================================

function WorkflowNode({
  number,
  title,
  description,
  complete = false,
}) {

  return (

    <div
      className={
        `workflow-node ${
          complete
            ? "complete"
            : ""
        }`
      }
    >

      <div
        className={
          `workflow-number ${
            complete
              ? "complete"
              : ""
          }`
        }
      >

        {complete
          ? "✓"
          : number}

      </div>

      <strong>
        {title}
      </strong>

      <span>
        {description}
      </span>

    </div>

  );

}


// ============================================================
// WORKFLOW CONNECTOR
// ============================================================

function WorkflowConnector() {

  return (

    <div className="workflow-connector">
      →
    </div>

  );

}


// ============================================================
// MODEL SCORE
// ============================================================

function ModelScore({
  label,
  value,
  featured,
}) {

  return (

    <div
      className={
        `model-score ${
          featured
            ? "featured"
            : ""
        }`
      }
    >

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );

}


// ============================================================
// PROOF ITEM
// ============================================================

function ProofItem({
  label,
  value,
  mono,
}) {

  return (

    <div className="proof-item">

      <span>
        {label}
      </span>

      <strong
        className={
          mono
            ? "mono"
            : ""
        }
      >
        {value}
      </strong>

    </div>

  );

}


// ============================================================
// TRANSACTION TABLE
// ============================================================

function TransactionTable({
  transactions,
  formatRupees,
}) {

  return (

    <div className="table-scroll">

      <table className="professional-table">

        <thead>

          <tr>

            <th>
              Transaction
            </th>

            <th>
              Amount
            </th>

            <th>
              Recovery probability
            </th>

            <th>
              Diagnosis
            </th>

            <th>
              Action
            </th>

            <th>
              Result
            </th>

          </tr>

        </thead>


        <tbody>

          {transactions
            .slice()
            .reverse()
            .slice(
              0,
              8
            )
            .map(
              (
                transaction,
                index
              ) => (

                <tr
                  key={
                    transaction.transaction_id ||
                    index
                  }
                >

                  <td className="mono">

                    {
                      transaction.transaction_id ||
                      "—"
                    }

                  </td>


                  <td>

                    {formatRupees(
                      transaction.amount
                    )}

                  </td>


                  <td>

                    <div className="table-probability">

                      <span>

                        {(
                          Number(
                            transaction.recovery_probability ||
                            0
                          ) *
                          100
                        ).toFixed(1)}

                        %

                      </span>


                      <div>

                        <i
                          style={{
                            width:
                              `${
                                Math.min(
                                  Number(
                                    transaction.recovery_probability ||
                                    0
                                  ) *
                                  100,
                                  100
                                )
                              }%`,
                          }}
                        />

                      </div>

                    </div>

                  </td>


                  <td>

                    {
                      transaction.diagnosis ||
                      "—"
                    }

                  </td>


                  <td>

                    {
                      transaction.selected_action ||
                      "—"
                    }

                  </td>


                  <td>

                    <span
                      className={
                        `table-status ${
                          statusClass(
                            transaction.result_status
                          )
                        }`
                      }
                    >

                      {
                        transaction.result_status ||
                        "pending"
                      }

                    </span>

                  </td>

                </tr>

              )
            )}

        </tbody>

      </table>


      {transactions.length ===
        0 && (

        <div className="empty-state">

          No transactions available.

        </div>

      )}

    </div>

  );

}


// ============================================================
// CARD HEADER
// ============================================================

function CardHeader({
  title,
  description,
  badge,
  action,
}) {

  return (

    <div className="card-header">

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>


      {badge && (

        <span className="card-badge">
          {badge}
        </span>

      )}


      {action}

    </div>

  );

}


// ============================================================
// EXPORT
// ============================================================

export default App;