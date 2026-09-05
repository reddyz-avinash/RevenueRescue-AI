import React, { useMemo, useState } from "react";
import "./Audit.css";

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function statusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("recover") || s.includes("success")) return "recovered";
  if (s.includes("fail")) return "failed";
  if (s.includes("escal")) return "escalated";
  if (s.includes("stop")) return "stopped";
  return "pending";
}

export default function AuditView({
  auditRecords = [],
  formatRupees = money,
  statusClass: externalStatusClass,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const getStatusClass = externalStatusClass || statusClass;

  const records = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditRecords
      .slice()
      .reverse()
      .filter(r => {
        const current = String(r?.result_status || "pending").toLowerCase();
        const matchesStatus = status === "all" || current === status;
        const haystack = [
          r?.transaction_id,
          r?.customer_id,
          r?.diagnosis,
          r?.recommended_strategy,
          r?.selected_action,
          r?.risk_level,
          r?.result_status,
        ].join(" ").toLowerCase();
        return matchesStatus && (!q || haystack.includes(q));
      })
      .slice(0, 100);
  }, [auditRecords, query, status]);

  const recoveredValue = auditRecords.reduce(
    (sum, r) => sum + (Number(r?.amount_recovered) || 0),
    0
  );

  return (
    <div className="audit-page">
      <div className="audit-page-header">
        <div>
          <span>AUDITABILITY · OPERATIONS</span>
          <h1>Recovery Audit Trail</h1>
          <p>Trace every AI decision, intervention and verified outcome.</p>
        </div>
        <div className="audit-header-stats">
          <div><span>RECORDS</span><strong>{auditRecords.length}</strong></div>
          <div><span>RECOVERED</span><strong>{formatRupees(recoveredValue)}</strong></div>
        </div>
      </div>

      <section className="audit-controls card">
        <div>
          <span>AUDIT SEARCH</span>
          <strong>Operational event ledger</strong>
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search transaction, diagnosis, action..."
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="recovered">Recovered</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="escalated">Escalated</option>
          <option value="stopped">Stopped</option>
        </select>
      </section>

      <section className="audit-table-card card">
        <div className="audit-table-head">
          <div>
            <span>EVENT LEDGER</span>
            <h2>{records.length} visible records</h2>
          </div>
          <span className="audit-live">● LIVE AUDIT DATA</span>
        </div>

        {records.length ? (
          <div className="audit-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Amount</th>
                  <th>Probability</th>
                  <th>Diagnosis</th>
                  <th>Strategy</th>
                  <th>Action</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Recovered</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={`${r?.transaction_id || "record"}-${i}`}>
                    <td className="mono">{r?.transaction_id || "—"}</td>
                    <td>{formatRupees(r?.amount)}</td>
                    <td>{(Number(r?.recovery_probability || 0) * 100).toFixed(1)}%</td>
                    <td>{r?.diagnosis || "—"}</td>
                    <td>{r?.recommended_strategy || "—"}</td>
                    <td>{r?.selected_action || "—"}</td>
                    <td>{r?.risk_level || "—"}</td>
                    <td>
                      <span className={`audit-status ${getStatusClass(r?.result_status)}`}>
                        {r?.result_status || "pending"}
                      </span>
                    </td>
                    <td className="audit-green">{formatRupees(r?.amount_recovered)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="audit-empty">
            <div>▤</div>
            <strong>No audit records found</strong>
            <p>Run the recovery agent to generate auditable events.</p>
          </div>
        )}
      </section>
    </div>
  );
}
