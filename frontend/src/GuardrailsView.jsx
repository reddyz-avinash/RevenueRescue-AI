import React, { useMemo } from "react";
import "./Guardrails.css";

export default function GuardrailsView({ metrics = {}, auditRecords = [] }) {
  const total = Number(metrics.transactions) || auditRecords.length || 0;
  const escalated = Number(metrics.escalated) || 0;
  const stopped = Number(metrics.stopped) || 0;
  const failed = Number(metrics.failed) || 0;

  const policyStats = useMemo(() => {
    const retry = auditRecords.filter(r => {
      const action = String(r?.selected_action || "").toLowerCase();
      return action.includes("retry");
    }).length;

    const links = auditRecords.filter(r =>
      String(r?.selected_action || "").toLowerCase().includes("link")
    ).length;

    const risky = auditRecords.filter(r => {
      const p = Number(r?.recovery_probability) || 0;
      return p < 0.5;
    }).length;

    return { retry, links, risky };
  }, [auditRecords]);

  const rules = [
    {
      id: "G-01",
      title: "Bounded recovery actions",
      description: "Only predefined recovery actions can be selected by the agent.",
      status: "ENFORCED",
      tone: "green",
      value: "Allowlist",
    },
    {
      id: "G-02",
      title: "Human escalation",
      description: "Uncertain or policy-sensitive cases can be routed to an operator.",
      status: "ENFORCED",
      tone: "purple",
      value: `${escalated} cases`,
    },
    {
      id: "G-03",
      title: "Stopping conditions",
      description: "Cases can stop instead of being repeatedly acted on when recovery is not appropriate.",
      status: "ENFORCED",
      tone: "slate",
      value: `${stopped} stopped`,
    },
    {
      id: "G-04",
      title: "Payment verification",
      description: "Recovery is only treated as complete after payment status and amount are verified.",
      status: "ENFORCED",
      tone: "blue",
      value: "Verified",
    },
    {
      id: "G-05",
      title: "Audit logging",
      description: "Decision, action, result, reason and recovery value are retained for traceability.",
      status: "ENFORCED",
      tone: "green",
      value: "Logged",
    },
    {
      id: "G-06",
      title: "Low-confidence restraint",
      description: "Lower recovery probability should prefer assisted recovery or review over aggressive automation.",
      status: "ENFORCED",
      tone: "orange",
      value: `${policyStats.risky} low-confidence`,
    },
  ];

  return (
    <>
      <section className="guard-hero">
        <div>
          <span className="guard-kicker">AI GOVERNANCE · POLICY CONTROL</span>
          <h1>Guardrails</h1>
          <p>
            RevenueRescue is designed to recover revenue without giving the
            agent unrestricted authority. Policies constrain what it can do,
            when it must stop, and when a human must take over.
          </p>
          <div className="guard-hero-tags">
            <span>BOUNDED ACTIONS</span>
            <span>STOPPING RULES</span>
            <span>HUMAN ESCALATION</span>
            <span>AUDITABLE</span>
          </div>
        </div>

        <div className="guard-hero-state">
          <div className="guard-shield">✓</div>
          <div>
            <span>POLICY ENGINE</span>
            <strong>PROTECTED</strong>
            <small>{total.toLocaleString("en-IN")} transactions under policy</small>
          </div>
        </div>
      </section>

      <div className="guard-summary">
        <Summary title="Policy rules" value="06" caption="Active controls" tone="blue" />
        <Summary title="Escalated" value={escalated} caption="Human review route" tone="purple" />
        <Summary title="Stopped" value={stopped} caption="Policy stop events" tone="slate" />
        <Summary title="Failed" value={failed} caption="Unsuccessful outcomes" tone="red" />
      </div>

      <section className="guard-control-panel card">
        <div className="guard-section-head">
          <div>
            <span>CONTROL PLANE</span>
            <h2>Recovery policy controls</h2>
            <p>Every recovery decision passes through a bounded policy layer.</p>
          </div>
          <div className="policy-status">
            <i /> ALL SYSTEMS PROTECTED
          </div>
        </div>

        <div className="policy-flow">
          <FlowStep number="01" title="AI detects" text="Risk and payment context" />
          <FlowArrow />
          <FlowStep number="02" title="Policy checks" text="Probability + diagnosis + limits" />
          <FlowArrow />
          <FlowStep number="03" title="Bounded action" text="Only approved intervention" />
          <FlowArrow />
          <FlowStep number="04" title="Verify / stop" text="Confirm outcome or terminate" />
        </div>
      </section>

      <div className="guard-grid">
        <section className="guard-rules card">
          <div className="guard-card-head">
            <div>
              <span>ACTIVE POLICIES</span>
              <h3>Agent control rules</h3>
            </div>
            <b>6 / 6 ENFORCED</b>
          </div>

          <div className="guard-rule-list">
            {rules.map(rule => (
              <div className="guard-rule" key={rule.id}>
                <div className={`guard-rule-icon ${rule.tone}`}>✓</div>
                <div className="guard-rule-main">
                  <div className="guard-rule-title">
                    <strong>{rule.title}</strong>
                    <span>{rule.id}</span>
                  </div>
                  <p>{rule.description}</p>
                </div>
                <div className="guard-rule-value">
                  <span>{rule.status}</span>
                  <strong>{rule.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="guard-decision card">
          <div className="guard-card-head">
            <div>
              <span>DECISION SAFETY</span>
              <h3>Risk routing matrix</h3>
            </div>
          </div>

          <div className="risk-matrix">
            <MatrixRow
              level="HIGH"
              condition="Recovery probability ≥ 80%"
              route="Eligible for bounded recovery"
              tone="green"
            />
            <MatrixRow
              level="MEDIUM"
              condition="50% – 79.9%"
              route="Assisted recovery / review"
              tone="orange"
            />
            <MatrixRow
              level="LOW"
              condition="< 50%"
              route="Reminder, hold or escalation"
              tone="purple"
            />
          </div>

          <div className="decision-note">
            <span>!</span>
            <div>
              <strong>Policy over probability</strong>
              <p>
                A high model score does not override payment verification,
                retry limits, escalation rules or other bounded controls.
              </p>
            </div>
          </div>
        </section>

        <section className="guard-metrics card">
          <div className="guard-card-head">
            <div>
              <span>CONTROL TELEMETRY</span>
              <h3>Observed policy activity</h3>
            </div>
          </div>

          <Telemetry label="Recovery-link actions" value={policyStats.links} total={Math.max(total, 1)} />
          <Telemetry label="Retry-related actions" value={policyStats.retry} total={Math.max(total, 1)} />
          <Telemetry label="Low-confidence cases" value={policyStats.risky} total={Math.max(total, 1)} />
          <Telemetry label="Human escalations" value={escalated} total={Math.max(total, 1)} />
        </section>

        <section className="guard-principles card">
          <div className="guard-card-head">
            <div>
              <span>DESIGN PRINCIPLES</span>
              <h3>Why these guardrails matter</h3>
            </div>
          </div>

          <Principle number="01" title="Least privilege" text="The agent receives only the actions required for revenue recovery." />
          <Principle number="02" title="Fail safely" text="When confidence or policy conditions are unfavorable, the workflow can stop." />
          <Principle number="03" title="Human override" text="Operators can review, hold or escalate cases that need judgment." />
          <Principle number="04" title="Evidence first" text="Decisions and outcomes are recorded so recovery can be inspected after execution." />
        </section>
      </div>

      <section className="guard-bottom card">
        <div className="guard-bottom-icon">✓</div>
        <div>
          <span>TRACK 3 COMPLIANCE SIGNAL</span>
          <h2>AI is bounded, measurable and auditable.</h2>
          <p>
            RevenueRescue does not stop at prediction. It combines intervention
            rules, stopping conditions, human escalation and payment verification
            to create a controlled revenue-recovery loop.
          </p>
        </div>
      </section>
    </>
  );
}

function Summary({ title, value, caption, tone }) {
  return (
    <div className="guard-summary-card card">
      <i className={`guard-summary-accent ${tone}`} />
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div className="policy-flow-step">
      <span>{number}</span>
      <strong>{title}</strong>
      <small>{text}</small>
    </div>
  );
}

function FlowArrow() {
  return <b className="policy-flow-arrow">→</b>;
}

function MatrixRow({ level, condition, route, tone }) {
  return (
    <div className="matrix-row">
      <div className={`matrix-level ${tone}`}>{level}</div>
      <div>
        <strong>{condition}</strong>
        <span>{route}</span>
      </div>
    </div>
  );
}

function Telemetry({ label, value, total }) {
  const percent = Math.min((Number(value) / total) * 100, 100);
  return (
    <div className="telemetry-row">
      <div className="telemetry-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="telemetry-track">
        <i style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Principle({ number, title, text }) {
  return (
    <div className="principle">
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
