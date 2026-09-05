import React, { useMemo } from "react";
import "./Analytics.css";

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function compact(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return money(n);
}

export default function AnalyticsView({
  metrics,
  auditRecords = [],
  outcomeData = [],
  formatRupees = money,
}) {
  const total = Number(metrics?.transactions) || 0;
  const recovered = Number(metrics?.recovered) || 0;
  const risk = Number(metrics?.revenue_at_risk) || 0;
  const revenueRecovered = Number(metrics?.revenue_recovered) || 0;
  const rate = Number(metrics?.recovery_rate) || 0;

  const diagnoses = useMemo(() => {
    const map = {};
    auditRecords.forEach(r => {
      const key = r?.diagnosis || "Unknown";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 6);
  }, [auditRecords]);

  const strategies = useMemo(() => {
    const map = {};
    auditRecords.forEach(r => {
      const key = r?.recommended_strategy || "Unknown";
      if (!map[key]) map[key] = { cases: 0, recovered: 0 };
      map[key].cases += 1;
      map[key].recovered += Number(r?.amount_recovered) || 0;
    });
    return Object.entries(map)
      .map(([name,v]) => ({ name, ...v }))
      .sort((a,b) => b.recovered - a.recovered || b.cases - a.cases);
  }, [auditRecords]);

  const daily = useMemo(() => {
    const map = {};
    auditRecords.forEach(r => {
      if (!r?.timestamp) return;
      const d = String(r.timestamp).slice(0,10);
      if (!map[d]) map[d] = { recovered: 0, cases: 0 };
      map[d].recovered += Number(r?.amount_recovered) || 0;
      map[d].cases += 1;
    });
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).slice(-8);
  }, [auditRecords]);

  const maxDiagnosis = Math.max(...diagnoses.map(x => x[1]), 1);
  const maxStrategy = Math.max(...strategies.map(x => x.recovered), 1);
  const maxDaily = Math.max(...daily.map(x => x[1].recovered), 1);

  const recoveredCaseRate = total ? (recovered / total) * 100 : 0;
  const avgRecovered = recovered ? revenueRecovered / recovered : 0;
  const unrecovered = Math.max(risk - revenueRecovered, 0);

  return (
    <>
      <div className="analytics-hero">
        <div>
          <span className="analytics-kicker">AI PERFORMANCE INTELLIGENCE</span>
          <h1>Recovery Analytics</h1>
          <p>
            Measure how RevenueRescue converts risky payment events into
            recoverable outcomes, and where the agent performs best.
          </p>
        </div>
        <div className="analytics-hero-stat">
          <span>RECOVERY EFFICIENCY</span>
          <strong>{rate.toFixed(1)}%</strong>
          <small>{compact(revenueRecovered)} verified</small>
        </div>
      </div>

      <div className="analytics-command-grid">
        <Metric label="Transactions evaluated" value={total.toLocaleString("en-IN")} caption="Batch coverage" />
        <Metric label="Revenue exposure" value={compact(risk)} caption="Gross revenue at risk" />
        <Metric label="Revenue recovered" value={compact(revenueRecovered)} caption="Verified recovery" green />
        <Metric label="Avg. recovered / case" value={money(avgRecovered)} caption="Recovered cases only" purple />
      </div>

      <div className="analytics-insight card">
        <div className="insight-icon">✦</div>
        <div>
          <span>AGENT PERFORMANCE SIGNAL</span>
          <strong>
            {recoveredCaseRate.toFixed(1)}% of evaluated cases ended in recovery.
          </strong>
          <p>
            {compact(unrecovered)} remains exposed after the current recovery batch.
            Use diagnosis and strategy breakdowns below to identify the highest-value intervention opportunities.
          </p>
        </div>
      </div>

      <div className="analytics-grid-pro">

        <section className="chart-card analytics-chart">
          <Header title="Outcome distribution" description="How the recovery portfolio was resolved" badge="CASES" />
          <div className="outcome-bars">
            {outcomeData.map(item => {
              const value = Number(item.value) || 0;
              const share = total ? (value / total) * 100 : 0;
              return (
                <div className="outcome-bar-row" key={item.label}>
                  <div className="outcome-bar-label">
                    <span><i className={`analytics-dot ${item.className}`} />{item.label}</span>
                    <strong>{value} <small>{share.toFixed(1)}%</small></strong>
                  </div>
                  <div className="outcome-bar-track">
                    <i className={item.className} style={{width: `${total ? share : 0}%`}} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="chart-card analytics-chart">
          <Header title="Revenue recovery trend" description="Verified amount recovered per audit date" badge="₹ VALUE" />
          {daily.length ? (
            <div className="analytics-trend">
              {daily.map(([date, data]) => (
                <div className="analytics-trend-col" key={date}>
                  <span>{data.recovered ? compact(data.recovered) : ""}</span>
                  <div className="analytics-trend-track">
                    <i style={{height: `${data.recovered ? Math.max((data.recovered / maxDaily) * 100, 7) : 1}%`}} />
                  </div>
                  <small>{date.slice(5)}</small>
                </div>
              ))}
            </div>
          ) : (
            <Empty text="Run recovery events to populate the trend." />
          )}
        </section>

        <section className="chart-card analytics-chart">
          <Header title="Failure diagnosis" description="Root causes creating the most recovery opportunities" badge="ROOT CAUSE" />
          {diagnoses.length ? (
            <div className="diagnosis-pro">
              {diagnoses.map(([name,count], index) => (
                <div className="diagnosis-pro-row" key={name}>
                  <b>{String(index+1).padStart(2,"0")}</b>
                  <div>
                    <div className="diagnosis-pro-title">
                      <span>{name}</span>
                      <strong>{count}</strong>
                    </div>
                    <div className="diagnosis-pro-track">
                      <i style={{width: `${(count / maxDiagnosis) * 100}%`}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <Empty text="No diagnosis data available yet." />}
        </section>

        <section className="chart-card analytics-chart">
          <Header title="Strategy performance" description="Where the agent generated recovery value" badge="₹ RECOVERED" />
          {strategies.length ? (
            <div className="strategy-performance">
              {strategies.slice(0,6).map(item => (
                <div className="strategy-performance-row" key={item.name}>
                  <div>
                    <span>{item.name}</span>
                    <small>{item.cases} cases</small>
                  </div>
                  <strong>{compact(item.recovered)}</strong>
                  <div className="strategy-performance-track">
                    <i style={{width: `${item.recovered ? Math.max((item.recovered / maxStrategy) * 100, 5) : 0}%`}} />
                  </div>
                </div>
              ))}
            </div>
          ) : <Empty text="No strategy data available yet." />}
        </section>
      </div>

      <section className="model-performance card">
        <Header title="ML model performance" description="Model metrics used by the RevenueRescue decision engine" badge="LOGISTIC REGRESSION" />
        <div className="model-metrics">
          <ModelMetric label="Accuracy" value="70.00%" />
          <ModelMetric label="Precision" value="71.15%" />
          <ModelMetric label="Recall" value="80.43%" />
          <ModelMetric label="F1 Score" value="75.51%" featured />
          <ModelMetric label="ROC-AUC" value="78.11%" />
        </div>
        <div className="threshold-row">
          <div className="threshold-value">0.40</div>
          <div>
            <span>OPTIMIZED DECISION THRESHOLD</span>
            <strong>Best F1 = 0.7652</strong>
            <p>
              The recovery policy uses the threshold selected through threshold analysis
              before a transaction is routed into a bounded recovery action.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({label,value,caption,green,purple}) {
  return (
    <div className="analytics-command-card">
      <span>{label}</span>
      <strong className={green ? "green" : purple ? "purple" : ""}>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}

function Header({title,description,badge}) {
  return (
    <div className="analytics-card-head">
      <div>
        <span>{title}</span>
        <h3>{description}</h3>
      </div>
      {badge && <b>{badge}</b>}
    </div>
  );
}

function Empty({text}) {
  return <div className="analytics-empty"><div>◌</div><span>{text}</span></div>;
}

function ModelMetric({label,value,featured}) {
  return (
    <div className={`model-metric ${featured ? "featured" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
