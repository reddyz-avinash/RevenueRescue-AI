import React, { useMemo } from "react";
import "./RecoveryFunnel.css";

function rupees(v) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);
}

function compact(v) {
  const n = Number(v) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return rupees(n);
}

export default function RecoveryFunnelView({
  metrics = {},
  auditRecords = [],
  transactions = [],
}) {
  const total = Number(metrics.transactions) || transactions.length || 0;
  const risk = Number(metrics.revenue_at_risk) || 0;
  const recovered = Number(metrics.revenue_recovered) || 0;
  const recoveredCases = Number(metrics.recovered) || 0;
  const pending = Number(metrics.pending) || 0;
  const escalated = Number(metrics.escalated) || 0;
  const failed = Number(metrics.failed) || 0;
  const stopped = Number(metrics.stopped) || 0;

  const decisionCount = auditRecords.length || total;
  const actionCount = auditRecords.filter(r => r?.selected_action).length || decisionCount;
  const verificationCount = auditRecords.filter(
    r => String(r?.result_status || "").toLowerCase() === "recovered"
  ).length || recoveredCases;

  const stages = [
    {
      number: "01",
      label: "Revenue exposure",
      value: risk,
      display: compact(risk),
      sub: "Revenue identified at risk",
      rate: 100,
      tone: "blue",
    },
    {
      number: "02",
      label: "Transactions detected",
      value: total,
      display: total.toLocaleString("en-IN"),
      sub: "Risk events evaluated",
      rate: risk > 0 ? Math.min((total / Math.max(total, 1)) * 100, 100) : 0,
      tone: "indigo",
    },
    {
      number: "03",
      label: "AI decisions",
      value: decisionCount,
      display: decisionCount.toLocaleString("en-IN"),
      sub: "Diagnose → decide",
      rate: total ? Math.min((decisionCount / total) * 100, 100) : 0,
      tone: "purple",
    },
    {
      number: "04",
      label: "Interventions",
      value: actionCount,
      display: actionCount.toLocaleString("en-IN"),
      sub: "Bounded recovery actions",
      rate: total ? Math.min((actionCount / total) * 100, 100) : 0,
      tone: "orange",
    },
    {
      number: "05",
      label: "Verified recovery",
      value: recovered,
      display: compact(recovered),
      sub: `${recoveredCases.toLocaleString("en-IN")} recovered cases`,
      rate: risk ? Math.min((recovered / risk) * 100, 100) : 0,
      tone: "green",
    },
  ];

  const outcomes = [
    ["Recovered", recoveredCases, "green"],
    ["Pending", pending, "amber"],
    ["Escalated", escalated, "purple"],
    ["Stopped", stopped, "slate"],
    ["Failed", failed, "red"],
  ];

  const strategyMap = useMemo(() => {
    const map = {};
    auditRecords.forEach(r => {
      const name = r?.recommended_strategy || "Unknown";
      if (!map[name]) map[name] = { cases: 0, amount: 0, recovered: 0 };
      map[name].cases += 1;
      map[name].amount += Number(r?.amount) || 0;
      map[name].recovered += Number(r?.amount_recovered) || 0;
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a,b) => b.amount - a.amount)
      .slice(0, 5);
  }, [auditRecords]);

  const maxStrategy = Math.max(...strategyMap.map(x => x.amount), 1);

  const verifiedRate = risk ? (recovered / risk) * 100 : 0;
  const actionCoverage = total ? (actionCount / total) * 100 : 0;
  const verificationRate = actionCount ? (verificationCount / actionCount) * 100 : 0;

  return (
    <>
      <section className="funnel-hero">
        <div>
          <span className="funnel-kicker">TRACK 3 · CLOSED-LOOP RECOVERY</span>
          <h1>Recovery Funnel</h1>
          <p>
            Follow the money from the moment revenue becomes at risk to the
            moment the recovery is verified.
          </p>
          <div className="funnel-proof-tags">
            <span>DETECT</span><b>→</b>
            <span>DIAGNOSE</span><b>→</b>
            <span>DECIDE</span><b>→</b>
            <span>ACT</span><b>→</b>
            <span>VERIFY</span>
          </div>
        </div>

        <div className="funnel-hero-money">
          <span>VERIFIED RECOVERY</span>
          <strong>{compact(recovered)}</strong>
          <small>{verifiedRate.toFixed(2)}% of revenue at risk</small>
        </div>
      </section>

      <section className="funnel-stage-panel card">
        <div className="funnel-panel-head">
          <div>
            <span>RECOVERY PIPELINE</span>
            <h2>Where revenue moves through the agent</h2>
          </div>
          <span className="funnel-live">● LIVE AUDIT DATA</span>
        </div>

        <div className="funnel-stages">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.number}>
              <div className={`funnel-stage ${stage.tone}`}>
                <div className="funnel-stage-top">
                  <span>{stage.number}</span>
                  <i>✓</i>
                </div>
                <strong>{stage.display}</strong>
                <b>{stage.label}</b>
                <small>{stage.sub}</small>
                <div className="funnel-stage-bar">
                  <i style={{ width: `${Math.max(stage.rate, stage.value ? 4 : 0)}%` }} />
                </div>
              </div>
              {index < stages.length - 1 && <div className="funnel-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="funnel-kpi-grid">
        <Kpi title="Recovery rate" value={`${Number(metrics.recovery_rate || 0).toFixed(2)}%`} sub="Revenue recovered / exposure" tone="green" />
        <Kpi title="Action coverage" value={`${actionCoverage.toFixed(1)}%`} sub="Cases reaching an action" tone="blue" />
        <Kpi title="Verification rate" value={`${verificationRate.toFixed(1)}%`} sub="Actions reaching recovery" tone="purple" />
        <Kpi title="Revenue remaining" value={compact(Math.max(risk - recovered, 0))} sub="Unrecovered exposure" tone="orange" />
      </div>

      <div className="funnel-grid">

        <section className="funnel-card card">
          <CardHeader title="Recovery economics" subtitle="Exposure converted into recovered value" />
          <div className="economics">
            <div className="economics-bar">
              <div className="economics-recovered" style={{ width: `${verifiedRate}%` }} />
            </div>
            <div className="economics-labels">
              <div>
                <span>AT RISK</span>
                <strong>{compact(risk)}</strong>
              </div>
              <div className="economics-right">
                <span>RECOVERED</span>
                <strong>{compact(recovered)}</strong>
              </div>
            </div>
          </div>
          <div className="economics-bottom">
            <MetricPair label="Recovered" value={`${verifiedRate.toFixed(2)}%`} />
            <MetricPair label="Remaining" value={compact(Math.max(risk - recovered, 0))} />
          </div>
        </section>

        <section className="funnel-card card">
          <CardHeader title="Outcome control" subtitle="Final disposition of evaluated cases" />
          <div className="outcome-control">
            {outcomes.map(([label, value, tone]) => {
              const share = total ? (value / total) * 100 : 0;
              return (
                <div className="outcome-control-row" key={label}>
                  <div>
                    <i className={`funnel-dot ${tone}`} />
                    <span>{label}</span>
                  </div>
                  <strong>{value}</strong>
                  <small>{share.toFixed(1)}%</small>
                  <div className="outcome-mini-track">
                    <i className={tone} style={{width: `${share}%`}} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="funnel-card card">
          <CardHeader title="Strategy routing" subtitle="Revenue exposure assigned to recovery strategies" />
          {strategyMap.length ? (
            <div className="routing-list">
              {strategyMap.map(item => (
                <div className="routing-row" key={item.name}>
                  <div className="routing-name">
                    <strong>{item.name}</strong>
                    <span>{item.cases} cases · {compact(item.amount)} exposed</span>
                  </div>
                  <div className="routing-value">{compact(item.recovered)}</div>
                  <div className="routing-track">
                    <i style={{width: `${(item.amount / maxStrategy) * 100}%`}} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty text="Strategy routing appears after audit records are created." />
          )}
        </section>

        <section className="funnel-card card">
          <CardHeader title="Stopping & escalation" subtitle="Safety controls around the recovery loop" />
          <div className="control-visual">
            <ControlLine label="Human escalation" value={escalated} tone="purple" />
            <ControlLine label="Stopped by policy" value={stopped} tone="slate" />
            <ControlLine label="Failed intervention" value={failed} tone="red" />
            <ControlLine label="Still pending" value={pending} tone="amber" />
          </div>
          <div className="guardrail-note">
            <span>✓</span>
            <p>
              Recovery is not treated as complete until the payment outcome
              is verified. Escalated and stopped cases remain visible for audit.
            </p>
          </div>
        </section>
      </div>

      <section className="funnel-demo-story card">
        <div>
          <span>JUDGE-READY STORY</span>
          <h2>RevenueRescue closes the loop</h2>
          <p>
            The agent does more than predict risk: it diagnoses the event,
            chooses a bounded intervention, executes it, verifies the payment,
            and records the outcome.
          </p>
        </div>
        <div className="story-flow">
          <StoryNode label="Risk" value={compact(risk)} />
          <b>→</b>
          <StoryNode label="AI decisions" value={decisionCount} />
          <b>→</b>
          <StoryNode label="Actions" value={actionCount} />
          <b>→</b>
          <StoryNode label="Verified" value={compact(recovered)} success />
        </div>
      </section>
    </>
  );
}

function CardHeader({ title, subtitle }) {
  return (
    <div className="funnel-card-head">
      <div>
        <span>{title}</span>
        <h3>{subtitle}</h3>
      </div>
    </div>
  );
}

function Kpi({ title, value, sub, tone }) {
  return (
    <div className="funnel-kpi card">
      <i className={`funnel-kpi-icon ${tone}`} />
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}

function MetricPair({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ControlLine({ label, value, tone }) {
  return (
    <div className="control-line">
      <div>
        <i className={`funnel-dot ${tone}`} />
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function StoryNode({ label, value, success }) {
  return (
    <div className={`story-node ${success ? "success" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="funnel-empty">
      <span>◌</span>
      <p>{text}</p>
    </div>
  );
}
