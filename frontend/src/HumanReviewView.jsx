import React, { useMemo, useState } from "react";
import "./HumanReview.css";

function compactINR(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

function riskTone(value) {
  const p = Number(value) || 0;
  if (p >= 0.8) return "high";
  if (p >= 0.5) return "medium";
  return "low";
}

function labelize(value) {
  return String(value || "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default function HumanReviewView({
  auditRecords = [],
  transactions = [],
  metrics = {},
}) {
  const source = auditRecords.length ? auditRecords : transactions;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [decisions, setDecisions] = useState({});
  const [filter, setFilter] = useState("all");

  const cases = useMemo(() => {
    return source.map((r, index) => {
      const probability =
        Number(r?.recovery_probability ?? r?.probability ?? 0);

      const status = String(
        r?.result_status ?? r?.status ?? "pending"
      ).toLowerCase();

      const risk =
        r?.risk_level ||
        riskTone(probability);

      return {
        ...r,
        __index: index,
        probability,
        status,
        risk,
        amount: Number(r?.amount) || 0,
        customer: r?.customer_id || "Unknown customer",
        transaction: r?.transaction_id || `CASE-${String(index + 1).padStart(4, "0")}`,
        diagnosis: r?.diagnosis || "No diagnosis available",
        strategy:
          r?.recommended_strategy ||
          r?.strategy ||
          "review",
        action:
          r?.selected_action ||
          r?.action ||
          "manual_review",
        reason:
          r?.decision_reason ||
          r?.reason ||
          "No decision explanation recorded.",
      };
    });
  }, [source]);

  const reviewable = cases.filter(c =>
    ["pending", "escalated", "failed"].includes(c.status)
  );

  const filtered = cases.filter(c => {
    if (filter === "all") return true;
    if (filter === "high") return c.risk === "high";
    if (filter === "pending") return c.status === "pending";
    if (filter === "escalated") return c.status === "escalated";
    return true;
  });

  const selected =
    filtered[selectedIndex] ||
    filtered[0] ||
    cases[0];

  const selectCase = c => {
    const idx = filtered.findIndex(
      item => item.__index === c.__index
    );
    setSelectedIndex(Math.max(idx, 0));
  };

  const decide = decision => {
    if (!selected) return;
    setDecisions(prev => ({
      ...prev,
      [selected.__index]: decision,
    }));
  };

  const selectedDecision =
    selected ? decisions[selected.__index] : null;

  return (
    <>
      <section className="review-hero">
        <div>
          <span className="review-kicker">
            HUMAN-IN-THE-LOOP CONTROL
          </span>
          <h1>Human Review</h1>
          <p>
            Give operators a controlled queue for cases that should not be
            resolved automatically. Every decision remains explainable,
            bounded and auditable.
          </p>
        </div>

        <div className="review-hero-stat">
          <span>CASES REQUIRING ATTENTION</span>
          <strong>{reviewable.length}</strong>
          <small>Pending · escalated · failed</small>
        </div>
      </section>

      <div className="review-kpis">
        <ReviewKpi
          label="Review queue"
          value={reviewable.length}
          caption="Cases needing operator attention"
          tone="orange"
        />
        <ReviewKpi
          label="High risk"
          value={cases.filter(c => c.risk === "high").length}
          caption="Recovery probability ≥ 80%"
          tone="red"
        />
        <ReviewKpi
          label="Escalated"
          value={Number(metrics.escalated) || cases.filter(c => c.status === "escalated").length}
          caption="Human intervention route"
          tone="purple"
        />
        <ReviewKpi
          label="Protected revenue"
          value={compactINR(
            cases
              .filter(c => c.risk === "high")
              .reduce((sum, c) => sum + c.amount, 0)
          )}
          caption="High-priority exposure"
          tone="green"
        />
      </div>

      <div className="review-toolbar card">
        <div>
          <span>OPERATOR QUEUE</span>
          <strong>Select a case to inspect AI reasoning</strong>
        </div>

        <div className="review-filters">
          {[
            ["all", "All cases"],
            ["pending", "Pending"],
            ["escalated", "Escalated"],
            ["high", "High risk"],
          ].map(([key, text]) => (
            <button
              key={key}
              className={filter === key ? "active" : ""}
              onClick={() => {
                setFilter(key);
                setSelectedIndex(0);
              }}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      <div className="review-layout">
        <section className="review-queue card">
          <div className="review-queue-head">
            <div>
              <span>RECOVERY CASES</span>
              <h2>{filtered.length} visible</h2>
            </div>
            <span className="queue-live">● AUDIT DATA</span>
          </div>

          <div className="review-case-list">
            {filtered.length ? (
              filtered.map(c => (
                <button
                  key={c.__index}
                  className={`review-case ${
                    selected?.__index === c.__index ? "selected" : ""
                  }`}
                  onClick={() => selectCase(c)}
                >
                  <div className={`review-risk ${c.risk}`}>
                    {c.risk === "high" ? "!" : c.risk === "medium" ? "•" : "✓"}
                  </div>

                  <div className="review-case-main">
                    <div className="review-case-line">
                      <strong>{c.transaction}</strong>
                      <span className={`review-status ${c.status}`}>
                        {labelize(c.status)}
                      </span>
                    </div>
                    <span>{c.customer}</span>
                    <small>{labelize(c.diagnosis)}</small>
                  </div>

                  <div className="review-case-money">
                    <strong>{compactINR(c.amount)}</strong>
                    <small>{(c.probability * 100).toFixed(1)}% recovery</small>
                  </div>
                </button>
              ))
            ) : (
              <div className="review-empty">
                <span>✓</span>
                <strong>No cases in this queue</strong>
                <p>Try another filter or run a recovery batch.</p>
              </div>
            )}
          </div>
        </section>

        <section className="review-detail card">
          {selected ? (
            <>
              <div className="review-detail-head">
                <div>
                  <span>CASE {selected.transaction}</span>
                  <h2>{selected.customer}</h2>
                  <p>{labelize(selected.diagnosis)}</p>
                </div>

                <div className={`review-risk-score ${selected.risk}`}>
                  <span>RECOVERY PROBABILITY</span>
                  <strong>{(selected.probability * 100).toFixed(1)}%</strong>
                  <small>{labelize(selected.risk)} risk</small>
                </div>
              </div>

              <div className="review-detail-grid">
                <DetailMetric label="Amount at risk" value={compactINR(selected.amount)} />
                <DetailMetric label="Recommended strategy" value={labelize(selected.strategy)} />
                <DetailMetric label="Selected action" value={labelize(selected.action)} />
                <DetailMetric label="Current status" value={labelize(selected.status)} />
              </div>

              <div className="ai-reasoning">
                <div className="reasoning-icon">✦</div>
                <div>
                  <span>AI DECISION REASON</span>
                  <strong>{selected.reason}</strong>
                  <p>
                    The recommendation is based on the recovery probability,
                    failure diagnosis and policy constraints recorded for this case.
                  </p>
                </div>
              </div>

              <div className="recommended-action">
                <div>
                  <span>RECOMMENDED OPERATOR ACTION</span>
                  <strong>{labelize(selected.action)}</strong>
                </div>
                <span className={`review-status ${selected.status}`}>
                  {selectedDecision
                    ? `Operator: ${labelize(selectedDecision)}`
                    : "Awaiting decision"}
                </span>
              </div>

              <div className="review-decision-area">
                <div>
                  <span>CONTROLLED DECISION</span>
                  <p>
                    Choose one bounded outcome. The choice is local to this
                    UI until the backend review endpoint is connected.
                  </p>
                </div>

                <div className="review-actions">
                  <button
                    className={`review-action approve ${
                      selectedDecision === "approve" ? "chosen" : ""
                    }`}
                    onClick={() => decide("approve")}
                  >
                    <b>✓</b>
                    <span>Approve action</span>
                    <small>Allow recommended intervention</small>
                  </button>

                  <button
                    className={`review-action hold ${
                      selectedDecision === "hold" ? "chosen" : ""
                    }`}
                    onClick={() => decide("hold")}
                  >
                    <b>Ⅱ</b>
                    <span>Hold for review</span>
                    <small>Pause before execution</small>
                  </button>

                  <button
                    className={`review-action escalate ${
                      selectedDecision === "escalate" ? "chosen" : ""
                    }`}
                    onClick={() => decide("escalate")}
                  >
                    <b>↗</b>
                    <span>Escalate</span>
                    <small>Route to senior operator</small>
                  </button>
                </div>
              </div>

              <div className="review-audit-note">
                <span>✓</span>
                <div>
                  <strong>Audit-safe workflow</strong>
                  <p>
                    AI recommends; policy controls execution; humans can
                    override, hold or escalate. No payment is automatically
                    executed by these buttons.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="review-detail-empty">
              <span>◎</span>
              <h2>Select a recovery case</h2>
              <p>Choose a case from the operator queue to inspect its reasoning.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function ReviewKpi({ label, value, caption, tone }) {
  return (
    <div className="review-kpi card">
      <i className={`review-kpi-accent ${tone}`} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}

function DetailMetric({ label, value }) {
  return (
    <div className="detail-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
