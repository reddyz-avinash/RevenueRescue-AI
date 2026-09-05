import React, { useMemo } from "react";
import "./Dashboard.css";

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function compactMoney(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return money(n);
}

function pct(value) {
  return `${(Number(value) || 0).toFixed(2)}%`;
}

function text(value, fallback = "—") {
  return value === undefined || value === null || value === ""
    ? fallback
    : String(value);
}

export default function Dashboard({
  metrics,
  auditRecords = [],
  transactions = [],
}) {
  const m = {
    transactions: Number(metrics?.transactions) || transactions.length || 0,
    revenue_at_risk: Number(metrics?.revenue_at_risk) || 0,
    revenue_recovered: Number(metrics?.revenue_recovered) || 0,
    recovery_rate: Number(metrics?.recovery_rate) || 0,
    recovered: Number(metrics?.recovered) || 0,
    pending: Number(metrics?.pending) || 0,
    failed: Number(metrics?.failed) || 0,
    escalated: Number(metrics?.escalated) || 0,
    stopped: Number(metrics?.stopped) || 0,
    automatic_interventions: Number(metrics?.automatic_interventions) || 0,
  };

  const recoveredShare =
    m.revenue_at_risk > 0
      ? Math.min((m.revenue_recovered / m.revenue_at_risk) * 100, 100)
      : 0;

  const outcomeData = [
    ["Recovered", m.recovered, "green"],
    ["Pending", m.pending, "amber"],
    ["Human escalation", m.escalated, "purple"],
    ["Stopped", m.stopped, "slate"],
    ["Failed", m.failed, "red"],
  ];

  const maxOutcome = Math.max(...outcomeData.map(x => x[1]), 1);

  const trend = useMemo(() => {
    const byDate = {};
    auditRecords.forEach(r => {
      if (!r?.timestamp) return;
      const date = String(r.timestamp).slice(0, 10);
      byDate[date] = (byDate[date] || 0) + (Number(r.amount_recovered) || 0);
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10);
  }, [auditRecords]);

  const maxTrend = Math.max(...trend.map(x => x[1]), 1);

  const strategyData = useMemo(() => {
    const map = {};
    auditRecords.forEach(r => {
      const key = text(r.recommended_strategy, "Unknown");
      if (!map[key]) map[key] = { cases: 0, recovered: 0 };
      map[key].cases += 1;
      map[key].recovered += Number(r.amount_recovered) || 0;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, ...value }))
      .sort((a, b) => b.recovered - a.recovered || b.cases - a.cases)
      .slice(0, 5);
  }, [auditRecords]);

  const maxStrategy = Math.max(...strategyData.map(x => x.recovered), 1);

  const recent = auditRecords
    .filter(r => Number(r.amount_recovered) > 0)
    .slice(-6)
    .reverse();

  const automatic =
    m.automatic_interventions ||
    Math.max(m.recovered + m.pending + m.failed + m.stopped, 0);

  return (
    <section className="rr-dashboard">

      <div className="rr-hero">
        <div className="rr-hero-copy">
          <div className="rr-eyebrow">
            <span className="rr-live-dot" />
            EXECUTIVE REVENUE INTELLIGENCE
          </div>
          <h1>Revenue Recovery Command Center</h1>
          <p>
            A closed-loop view of revenue at risk, AI interventions,
            human escalation and verified recovery.
          </p>
          <div className="rr-hero-tags">
            <span>AI DECISIONING</span>
            <span>BOUNDED ACTIONS</span>
            <span>AUDITABLE</span>
          </div>
        </div>

        <div className="rr-hero-value">
          <span>VERIFIED REVENUE RECOVERED</span>
          <strong>{compactMoney(m.revenue_recovered)}</strong>
          <small>{pct(m.recovery_rate)} of exposed revenue</small>
        </div>
      </div>

      <div className="rr-kpis">
        <Kpi icon="₹" label="Revenue at risk" value={compactMoney(m.revenue_at_risk)} sub="Gross exposure" />
        <Kpi icon="✓" label="Revenue recovered" value={compactMoney(m.revenue_recovered)} sub="Verified recovery" green />
        <Kpi icon="%" label="Recovery rate" value={pct(m.recovery_rate)} sub="Recovery efficiency" purple />
        <Kpi icon="↗" label="Transactions" value={m.transactions.toLocaleString("en-IN")} sub="Evaluated by agent" orange />
      </div>

      <div className="rr-section-title">
        <div>
          <span>EXECUTIVE SNAPSHOT</span>
          <h2>Where the money moved</h2>
        </div>
        <span className="rr-data-badge">LIVE AUDIT DATA</span>
      </div>

      <div className="rr-main-grid">

        <div className="rr-card rr-impact-card">
          <CardHead label="RECOVERY IMPACT" title="Exposure converted into recovered revenue" />
          <div className="impact-layout">
            <div className="impact-ring" style={{
              background: `conic-gradient(#18a873 ${recoveredShare}%, #e9edf2 0)`
            }}>
              <div>
                <strong>{pct(m.recovery_rate)}</strong>
                <span>recovered</span>
              </div>
            </div>

            <div className="impact-copy">
              <div className="impact-number">{money(m.revenue_recovered)}</div>
              <span>recovered from {money(m.revenue_at_risk)} at risk</span>
              <div className="impact-progress">
                <i style={{ width: `${recoveredShare}%` }} />
              </div>
              <div className="impact-foot">
                <span>Remaining exposure</span>
                <strong>{money(Math.max(m.revenue_at_risk - m.revenue_recovered, 0))}</strong>
              </div>
            </div>
          </div>

          <div className="impact-stat-row">
            <MiniStat label="Recovered cases" value={m.recovered} />
            <MiniStat label="Automated handling" value={automatic} />
            <MiniStat label="Human escalation" value={m.escalated} />
          </div>
        </div>

        <div className="rr-card rr-outcome-card">
          <CardHead label="CASE OUTCOMES" title="Portfolio disposition" />
          <div className="outcome-layout">
            <div className="rr-donut" style={{
              background: buildDonut(outcomeData)
            }}>
              <div>
                <strong>{m.transactions.toLocaleString("en-IN")}</strong>
                <span>cases</span>
              </div>
            </div>
            <div className="outcome-list">
              {outcomeData.map(([label, value, color]) => (
                <div className="outcome-row" key={label}>
                  <div>
                    <i className={`dot ${color}`} />
                    <span>{label}</span>
                  </div>
                  <strong>{value}</strong>
                  <small>{((value / Math.max(m.transactions, 1)) * 100).toFixed(1)}%</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rr-main-grid">

        <div className="rr-card">
          <CardHead
            label="RECOVERY PERFORMANCE"
            title="Verified revenue recovered over time"
            badge="VERIFIED"
          />
          {trend.length ? (
            <div className="rr-trend">
              <div className="trend-axis">
                <span>{compactMoney(maxTrend)}</span>
                <span>{compactMoney(maxTrend / 2)}</span>
                <span>₹0</span>
              </div>
              <div className="trend-area">
                <div className="grid-line one" />
                <div className="grid-line two" />
                <div className="trend-columns">
                  {trend.map(([date, value]) => (
                    <div className="trend-column" key={date}>
                      <span className="trend-value">
                        {value ? compactMoney(value) : ""}
                      </span>
                      <div className="trend-track">
                        <i style={{ height: `${Math.max((value / maxTrend) * 100, value ? 5 : 1)}%` }} />
                      </div>
                      <small>{date.slice(5)}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyChart text="Run recovery events to populate the verified recovery trend." />
          )}
        </div>

        <div className="rr-card">
          <CardHead
            label="AI STRATEGY INTELLIGENCE"
            title="Recovery value by strategy"
            badge="AI DECISIONS"
          />
          {strategyData.length ? (
            <div className="strategy-chart">
              {strategyData.map(item => (
                <div className="strategy-item" key={item.name}>
                  <div className="strategy-top">
                    <span>{item.name}</span>
                    <strong>{money(item.recovered)}</strong>
                  </div>
                  <div className="strategy-track">
                    <i style={{ width: `${Math.max((item.recovered / maxStrategy) * 100, item.recovered ? 4 : 0)}%` }} />
                  </div>
                  <small>{item.cases} cases evaluated</small>
                </div>
              ))}
            </div>
          ) : (
            <EmptyChart text="Strategy performance will appear after recovery decisions are recorded." />
          )}
        </div>
      </div>

      <div className="rr-section-title compact">
        <div>
          <span>OPERATIONAL CONTROL</span>
          <h2>Agent activity and guardrails</h2>
        </div>
      </div>

      <div className="rr-control-grid">
        <ControlCard icon="✦" label="Automatic interventions" value={automatic} description="Cases handled without immediate human review." />
        <ControlCard icon="⚑" label="Human escalation" value={m.escalated} description="Cases intentionally routed for human oversight." purple />
        <ControlCard icon="■" label="Stopped cases" value={m.stopped} description="Cases terminated by recovery stopping rules." />
        <ControlCard icon="!" label="Failed actions" value={m.failed} description="Interventions that did not recover revenue." red />
      </div>

      <div className="rr-card rr-recent">
        <CardHead
          label="VERIFIED RECOVERIES"
          title="Latest successful money movement"
          badge="RAZORPAY VERIFIED"
        />
        {recent.length ? (
          <div className="recent-list">
            {recent.map((r, i) => (
              <div className="recent-row" key={`${r.transaction_id}-${i}`}>
                <div className="recent-check">✓</div>
                <div className="recent-info">
                  <strong>{text(r.transaction_id)}</strong>
                  <span>{text(r.diagnosis, "Recovery completed")}</span>
                </div>
                <span className="recent-action">{text(r.selected_action)}</span>
                <strong className="recent-money">+{money(r.amount_recovered)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyChart text="Verified recoveries will appear here after a payment is confirmed." />
        )}
      </div>

      <div className="rr-footer">
        <span>● RevenueRescue AI · Live backend data</span>
        <span>AI actions remain bounded by recovery policy and stopping rules.</span>
      </div>
    </section>
  );
}

function Kpi({ icon, label, value, sub, green, purple, orange }) {
  return (
    <div className="rr-kpi">
      <div className={`kpi-icon ${green ? "green" : purple ? "purple" : orange ? "orange" : ""}`}>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}

function CardHead({ label, title, badge }) {
  return (
    <div className="rr-card-head">
      <div>
        <span>{label}</span>
        <h3>{title}</h3>
      </div>
      {badge && <b>{badge}</b>}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <strong>{value.toLocaleString("en-IN")}</strong>
    </div>
  );
}

function ControlCard({ icon, label, value, description, purple, red }) {
  return (
    <div className="control-card">
      <div className={`control-icon ${purple ? "purple" : red ? "red" : ""}`}>{icon}</div>
      <span>{label}</span>
      <strong>{value.toLocaleString("en-IN")}</strong>
      <p>{description}</p>
    </div>
  );
}

function EmptyChart({ text }) {
  return (
    <div className="rr-empty">
      <div>◌</div>
      <span>{text}</span>
    </div>
  );
}

function buildDonut(items) {
  const total = Math.max(items.reduce((sum, x) => sum + x[1], 0), 1);
  const colors = ["#18a873", "#e4a72d", "#8062cc", "#7b8799", "#dc5c5c"];
  let start = 0;
  const segments = items.map((item, index) => {
    const end = start + (item[1] / total) * 360;
    const segment = `${colors[index]} ${start}deg ${end}deg`;
    start = end;
    return segment;
  });
  return `conic-gradient(${segments.join(", ")})`;
}
