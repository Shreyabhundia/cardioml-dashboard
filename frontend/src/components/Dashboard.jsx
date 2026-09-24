import React, { useState } from "react";
import Plot from "react-plotly.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Target,
  ArrowRight,
  Activity,
  Zap,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Clock,
  Layers,
  Search,
  PieChart,
} from "lucide-react";
import { MODEL_BENCHMARKS, FEATURE_IMPORTANCE } from "../data/mlData";
import "./Dashboard.css";

export default function Dashboard({ setActiveTab }) {
  const [metricTab, setMetricTab] = useState("importance");
  const [edaTab, setEdaTab] = useState("class_dist");
  const best = MODEL_BENCHMARKS[0];

  const stats = [
    {
      label: "Total Applications",
      value: "70,000",
      sub: "Active clinical cohort",
      icon: Users,
      tone: "indigo",
      badge: "+12% mo/mo",
    },
    {
      label: "Low Risk Patients",
      value: "34,370",
      sub: "49.1% safe baseline",
      icon: CheckCircle2,
      tone: "emerald",
      badge: "Stable",
    },
    {
      label: "High Risk Identified",
      value: "35,630",
      sub: "50.9% critical tracking",
      icon: AlertTriangle,
      tone: "rose",
      badge: "Action Req.",
    },
    {
      label: "Model Accuracy",
      value: `${best.accuracy}%`,
      sub: "Gradient Boosting v2.1",
      icon: Target,
      tone: "sky",
      badge: "Validated",
    },
  ];

  // Distribution chart bar simulation
  const distributionData = [
    { label: "Optimal (<10%)", value: 32, tone: "emerald" },
    { label: "Borderline (10-30%)", value: 24, tone: "emerald-soft" },
    { label: "Moderate (30-60%)", value: 22, tone: "amber" },
    { label: "High Risk (60-85%)", value: 14, tone: "rose-soft" },
    { label: "Critical (>85%)", value: 8, tone: "rose" },
  ];

  // Recent assessment records
  const recentAssessments = [
    { id: "PX-9042", age: "54y", gender: "Male", bp: "138/88", risk: "12%", level: "LOW" },
    { id: "PX-9041", age: "61y", gender: "Female", bp: "162/95", risk: "78%", level: "HIGH" },
    { id: "PX-9040", age: "48y", gender: "Male", bp: "124/80", risk: "28%", level: "MODERATE" },
    { id: "PX-9039", age: "67y", gender: "Female", bp: "154/90", risk: "84%", level: "HIGH" },
  ];

  // Plotly EDA Chart Configurations matching the target visualizations
  const renderEdaChart = () => {
    const layoutDefaults = {
      autosize: true,
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      margin: { l: 45, r: 25, t: 30, b: 45 },
      font: { color: "#64748b", family: "Inter, sans-serif" },
    };

    switch (edaTab) {
      case "class_dist":
        return (
          <Plot
            data={[
              {
                x: ["No Disease (0)", "Disease (1)"],
                y: [35021, 34979],
                type: "bar",
                marker: { color: ["#2b5c8f", "#d9534f"] },
                hoverinfo: "x+y",
              },
            ]}
            layout={{
              ...layoutDefaults,
              title: { text: "Cardiovascular Disease Class Distribution", font: { size: 14, color: "#1e293b" } },
              yaxis: { title: "Count", gridcolor: "#f1f5f9" },
            }}
            useResizeHandler
            style={{ width: "100%", height: "300px" }}
          />
        );
      case "age_dist":
        return (
          <Plot
            data={[
              {
                x: [35, 40, 45, 50, 55, 60, 65],
                y: [0.001, 0.035, 0.032, 0.052, 0.045, 0.035, 0.005],
                name: "No Disease (0)",
                type: "scatter",
                mode: "lines",
                fill: "tozeroy",
                line: { color: "#2b5c8f" },
              },
              {
                x: [35, 40, 45, 50, 55, 60, 65],
                y: [0.0005, 0.012, 0.022, 0.04, 0.058, 0.052, 0.008],
                name: "Disease (1)",
                type: "scatter",
                mode: "lines",
                fill: "tozeroy",
                line: { color: "#d9534f" },
              },
            ]}
            layout={{
              ...layoutDefaults,
              title: { text: "Age Distribution by Heart Disease Status", font: { size: 14, color: "#1e293b" } },
              xaxis: { title: "Age (Years)" },
              yaxis: { title: "Density", gridcolor: "#f1f5f9" },
            }}
            useResizeHandler
            style={{ width: "100%", height: "300px" }}
          />
        );
      case "cholesterol":
        return (
          <Plot
            data={[
              {
                x: ["Normal (1)", "Above Normal (2)", "Well Above (3)"],
                y: [29330, 3699, 1992],
                name: "No Disease (0)",
                type: "bar",
                marker: { color: "#2b5c8f" },
              },
              {
                x: ["Normal (1)", "Above Normal (2)", "Well Above (3)"],
                y: [23055, 5699, 6225],
                name: "Disease (1)",
                type: "bar",
                marker: { color: "#d9534f" },
              },
            ]}
            layout={{
              ...layoutDefaults,
              barmode: "group",
              title: { text: "Cholesterol Level vs. Heart Disease", font: { size: 14, color: "#1e293b" } },
              yaxis: { title: "Count", gridcolor: "#f1f5f9" },
            }}
            useResizeHandler
            style={{ width: "100%", height: "300px" }}
          />
        );
      case "correlation":
        const features = ["age", "height", "weight", "ap_hi", "ap_lo", "chol", "gluc", "smoke", "cardio"];
        const zValues = [
          [1.0, -0.08, 0.05, 0.02, 0.02, 0.15, 0.1, -0.05, 0.24],
          [-0.08, 1.0, 0.29, 0.01, 0.01, -0.05, -0.02, 0.19, -0.01],
          [0.05, 0.29, 1.0, 0.03, 0.04, 0.14, 0.11, 0.07, 0.18],
          [0.02, 0.01, 0.03, 1.0, 0.02, 0.02, 0.01, -0.0, 0.05],
          [0.02, 0.01, 0.04, 0.02, 1.0, 0.02, 0.01, 0.01, 0.07],
          [0.15, -0.05, 0.14, 0.02, 0.02, 1.0, 0.45, 0.01, 0.22],
          [0.1, -0.02, 0.11, 0.01, 0.01, 0.45, 1.0, -0.0, 0.09],
          [-0.05, 0.19, 0.07, -0.0, 0.01, 0.01, -0.0, 1.0, -0.02],
          [0.24, -0.01, 0.18, 0.05, 0.07, 0.22, 0.09, -0.02, 1.0],
        ];
        return (
          <Plot
            data={[
              {
                z: zValues,
                x: features,
                y: features,
                type: "heatmap",
                colorscale: "Coolwarm",
              },
            ]}
            layout={{
              ...layoutDefaults,
              title: { text: "Feature Correlation Matrix", font: { size: 14, color: "#1e293b" } },
              margin: { l: 60, r: 20, t: 30, b: 50 },
            }}
            useResizeHandler
            style={{ width: "100%", height: "300px" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="dashboard">
      {/* Top Notification Banner */}
      <div className="system-banner">
        <div className="system-banner-left">
          <span className="live-pulse" />
          <span className="system-banner-title">Clinical Engine v2.4 Active</span>
          <span className="system-banner-divider">•</span>
          <span className="system-banner-sub">Dataset balanced (68,443 records after cleaning)</span>
        </div>
        <div className="system-banner-right">
          <ShieldCheck size={14} />
          <span>HIPAA & GDPR Compliant Pipeline</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="dashboard-header">
        <div>
          <div className="header-badge">
            <Sparkles size={13} />
            <span>Cardiovascular Intelligence</span>
          </div>
          <h1>Clinical Dashboard</h1>
          <p>Real-time cohort monitoring, predictive risk profiling, and engine telemetry.</p>
        </div>

        <div className="header-actions">
          <button className="secondary-btn header-btn" onClick={() => setActiveTab("result")}>
            <BarChart3 size={16} />
            View Last Result
          </button>
          <button className="primary-btn header-btn" onClick={() => setActiveTab("predictor")}>
            New Assessment
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Key Performance Indicators */}
      <section className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.article
              className="stat-card"
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="stat-top">
                <span className="stat-label">{stat.label}</span>
                <span className={`stat-pill ${stat.tone}`}>{stat.badge}</span>
              </div>
              <div className="stat-middle">
                <h2>{stat.value}</h2>
                <div className={`stat-icon ${stat.tone}`}>
                  <Icon size={20} />
                </div>
              </div>
              <span className="stat-sub">{stat.sub}</span>
            </motion.article>
          );
        })}
      </section>

      {/* Exploratory Data Analysis (EDA) Interactive Panel */}
      <motion.section
        className="card eda-analytics-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="card-header">
          <div>
            <div className="card-subtitle">EXPLORATORY DATA ANALYSIS</div>
            <h3>Cohort Visual Insights</h3>
          </div>
          <div className="eda-tabs">
            <button
              className={`eda-tab ${edaTab === "class_dist" ? "active" : ""}`}
              onClick={() => setEdaTab("class_dist")}
            >
              <PieChart size={13} /> Class Balance
            </button>
            <button
              className={`eda-tab ${edaTab === "age_dist" ? "active" : ""}`}
              onClick={() => setEdaTab("age_dist")}
            >
              <TrendingUp size={13} /> Age Profile
            </button>
            <button
              className={`eda-tab ${edaTab === "cholesterol" ? "active" : ""}`}
              onClick={() => setEdaTab("cholesterol")}
            >
              <BarChart3 size={13} /> Cholesterol
            </button>
            <button
              className={`eda-tab ${edaTab === "correlation" ? "active" : ""}`}
              onClick={() => setEdaTab("correlation")}
            >
              <Layers size={13} /> Correlations
            </button>
          </div>
        </div>

        <div className="eda-chart-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={edaTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {renderEdaChart()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Main Analytical Grid */}
      <section className="main-grid">
        {/* Active ML Engine Profile */}
        <article className="card model-card">
          <div className="card-header">
            <div>
              <div className="card-subtitle">PREDICTIVE PIPELINE</div>
              <h3>Production Model Telemetry</h3>
            </div>
            <span className="status-badge">
              <span className="status-dot" />
              Optimal Status
            </span>
          </div>

          <div className="model-hero">
            <div className="model-icon-box">
              <Zap size={26} />
            </div>
            <div className="model-hero-text">
              <h4>Gradient Boosting Classifier</h4>
              <p>Optimized decision trees utilizing deviance loss optimization across 11 key clinical parameters.</p>
            </div>
          </div>

          <div className="model-kpis">
            <div className="kpi-item">
              <span className="kpi-label">Algorithm</span>
              <strong className="kpi-val">GBDT Ensembles</strong>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Trees / Estimators</span>
              <strong className="kpi-val">100 Trees</strong>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">ROC-AUC Score</span>
              <strong className="kpi-val">0.796</strong>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Test Accuracy</span>
              <strong className="kpi-val highlight">{best.accuracy}%</strong>
            </div>
          </div>

          {/* Model Metrics Toggle */}
          <div className="metrics-section">
            <div className="metrics-tabs">
              <button
                className={`metrics-tab ${metricTab === "importance" ? "active" : ""}`}
                onClick={() => setMetricTab("importance")}
              >
                <Layers size={13} /> Model Benchmarks
              </button>
              <button
                className={`metrics-tab ${metricTab === "performance" ? "active" : ""}`}
                onClick={() => setMetricTab("performance")}
              >
                <TrendingUp size={13} /> Key Predictors
              </button>
            </div>

            {metricTab === "performance" ? (
              <div className="importance-list">
                {FEATURE_IMPORTANCE.slice(0, 4).map((f, i) => (
                  <div className="importance-item" key={i}>
                    <div className="importance-meta">
                      <span className="importance-name">{f.feature}</span>
                      <span className="importance-score">{(f.importance * 100).toFixed(1)}% weight</span>
                    </div>
                    <div className="importance-bar-bg">
                      <div
                        className="importance-bar-fill"
                        style={{ width: `${Math.min(f.importance * 220, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="benchmark-mini-grid">
                {MODEL_BENCHMARKS.map((m, idx) => (
                  <div className="benchmark-mini-item" key={idx}>
                    <span className="benchmark-name">{m.name}</span>
                    <span className="benchmark-score">{m.accuracy}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Quick Action & Risk Distribution Column */}
        <div className="side-column">
          {/* Quick Assessment CTA */}
          <article className="card quick-card">
            <div className="quick-badge">
              <Activity size={14} />
              <span>Instant Diagnostic</span>
            </div>
            <h3>Patient Risk Scoring</h3>
            <p>Input patient vitals, cholesterol levels, and lifestyle factors to generate immediate probability scores.</p>
            <button className="primary-btn quick-btn" onClick={() => setActiveTab("predictor")}>
              Launch Calculator
              <ArrowRight size={16} />
            </button>
          </article>

          {/* Cohort Risk Distribution Breakdown */}
          <article className="card distribution-card">
            <div className="card-header-sm">
              <BarChart3 size={16} className="text-indigo" />
              <h4>Cohort Risk Stratification</h4>
            </div>
            <div className="distribution-bars">
              {distributionData.map((d, i) => (
                <div key={i} className="dist-row">
                  <div className="dist-meta">
                    <span className="dist-label">{d.label}</span>
                    <span className="dist-val">{d.value}%</span>
                  </div>
                  <div className="dist-bar-bg">
                    <div className={`dist-bar-fill ${d.tone}`} style={{ width: `${d.value * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* Recent Evaluations Table & Clinical Features */}
      <section className="bottom-grid">
        {/* Recent Evaluations */}
        <article className="card recent-card">
          <div className="card-header">
            <div>
              <div className="card-subtitle">AUDIT LOG</div>
              3. Recent Clinical Assessments
            </div>
            <div className="table-search">
              <Search size={13} />
              <span>Filter records</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="assessment-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Demographics</th>
                  <th>Blood Pressure</th>
                  <th>Calculated Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAssessments.map((row) => (
                  <tr key={row.id}>
                    <td className="font-mono">{row.id}</td>
                    <td>{row.age} · {row.gender}</td>
                    <td>{row.bp} mmHg</td>
                    <td><strong className="text-dark">{row.risk}</strong></td>
                    <td>
                      <span className={`table-badge ${row.level.toLowerCase()}`}>
                        {row.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Clinical Feature Matrix */}
        <article className="card features-card">
          <div className="card-header">
            <div>
              <div className="card-subtitle">INPUT PARAMETERS</div>
              3. Measured Clinical Attributes
            </div>
            <span className="feature-count">{FEATURE_IMPORTANCE.length} Variables</span>
          </div>

          <p className="features-desc">
            The neural gradient engine measures physical biological factors alongside self-reported lifestyle indicators.
          </p>

          <div className="feature-list">
            {FEATURE_IMPORTANCE.map((f, index) => (
              <span className="feature-tag" key={index}>
                <span className="feature-dot" />
                {f.feature}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}


// import React, { useState } from "react";
// import {
//   Users,
//   CheckCircle2,
//   AlertTriangle,
//   Target,
//   ArrowRight,
//   Activity,
//   Zap,
//   TrendingUp,
//   ShieldCheck,
//   Sparkles,
//   BarChart3,
//   Clock,
//   Layers,
//   Search,
// } from "lucide-react";
// import { MODEL_BENCHMARKS, FEATURE_IMPORTANCE } from "../data/mlData";
// import "./Dashboard.css";

// export default function Dashboard({ setActiveTab }) {
//   const [metricTab, setMetricTab] = useState("importance");
//   const best = MODEL_BENCHMARKS[0];

//   const stats = [
//     {
//       label: "Total Applications",
//       value: "70,000",
//       sub: "Active clinical cohort",
//       icon: Users,
//       tone: "indigo",
//       badge: "+12% mo/mo",
//     },
//     {
//       label: "Low Risk Patients",
//       value: "34,370",
//       sub: "49.1% safe baseline",
//       icon: CheckCircle2,
//       tone: "emerald",
//       badge: "Stable",
//     },
//     {
//       label: "High Risk Identified",
//       value: "35,630",
//       sub: "50.9% critical tracking",
//       icon: AlertTriangle,
//       tone: "rose",
//       badge: "Action Req.",
//     },
//     {
//       label: "Model Accuracy",
//       value: `${best.accuracy}%`,
//       sub: "Gradient Boosting v2.1",
//       icon: Target,
//       tone: "sky",
//       badge: "Validated",
//     },
//   ];

//   // Distribution chart bar simulation
//   const distributionData = [
//     { label: "Optimal (<10%)", value: 32, tone: "emerald" },
//     { label: "Borderline (10-30%)", value: 24, tone: "emerald-soft" },
//     { label: "Moderate (30-60%)", value: 22, tone: "amber" },
//     { label: "High Risk (60-85%)", value: 14, tone: "rose-soft" },
//     { label: "Critical (>85%)", value: 8, tone: "rose" },
//   ];

//   // Recent assessment records
//   const recentAssessments = [
//     { id: "PX-9042", age: "54y", gender: "Male", bp: "138/88", risk: "12%", level: "LOW" },
//     { id: "PX-9041", age: "61y", gender: "Female", bp: "162/95", risk: "78%", level: "HIGH" },
//     { id: "PX-9040", age: "48y", gender: "Male", bp: "124/80", risk: "28%", level: "MODERATE" },
//     { id: "PX-9039", age: "67y", gender: "Female", bp: "154/90", risk: "84%", level: "HIGH" },
//   ];

//   return (
//     <main className="dashboard">
//       {/* Top Notification Banner */}
//       <div className="system-banner">
//         <div className="system-banner-left">
//           <span className="live-pulse" />
//           <span className="system-banner-title">Clinical Engine v2.4 Active</span>
//           <span className="system-banner-divider">•</span>
//           <span className="system-banner-sub">Dataset balanced (68,443 records after cleaning)</span>
//         </div>
//         <div className="system-banner-right">
//           <ShieldCheck size={14} />
//           <span>HIPAA & GDPR Compliant Pipeline</span>
//         </div>
//       </div>

//       {/* Hero Header */}
//       <section className="dashboard-header">
//         <div>
//           <div className="header-badge">
//             <Sparkles size={13} />
//             <span>Cardiovascular Intelligence</span>
//           </div>
//           <h1>Clinical Dashboard</h1>
//           <p>Real-time cohort monitoring, predictive risk profiling, and engine telemetry.</p>
//         </div>

//         <div className="header-actions">
//           <button className="secondary-btn header-btn" onClick={() => setActiveTab("result")}>
//             <BarChart3 size={16} />
//             View Last Result
//           </button>
//           <button className="primary-btn header-btn" onClick={() => setActiveTab("predictor")}>
//             New Assessment
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </section>

//       {/* Key Performance Indicators */}
//       <section className="stats-grid">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;

//           return (
//             <article className="stat-card" key={index}>
//               <div className="stat-top">
//                 <span className="stat-label">{stat.label}</span>
//                 <span className={`stat-pill ${stat.tone}`}>{stat.badge}</span>
//               </div>
//               <div className="stat-middle">
//                 <h2>{stat.value}</h2>
//                 <div className={`stat-icon ${stat.tone}`}>
//                   <Icon size={20} />
//                 </div>
//               </div>
//               <span className="stat-sub">{stat.sub}</span>
//             </article>
//           );
//         })}
//       </section>

//       {/* Main Analytical Grid */}
//       <section className="main-grid">
//         {/* Active ML Engine Profile */}
//         <article className="card model-card">
//           <div className="card-header">
//             <div>
//               <div className="card-subtitle">PREDICTIVE PIPELINE</div>
//               <h3>Production Model Telemetry</h3>
//             </div>
//             <span className="status-badge">
//               <span className="status-dot" />
//               Optimal Status
//             </span>
//           </div>

//           <div className="model-hero">
//             <div className="model-icon-box">
//               <Zap size={26} />
//             </div>
//             <div className="model-hero-text">
//               <h4>Gradient Boosting Classifier</h4>
//               <p>Optimized decision trees utilizing deviance loss optimization across 11 key clinical parameters.</p>
//             </div>
//           </div>

//           <div className="model-kpis">
//             <div className="kpi-item">
//               <span className="kpi-label">Algorithm</span>
//               <strong className="kpi-val">GBDT Ensembles</strong>
//             </div>
//             <div className="kpi-item">
//               <span className="kpi-label">Trees / Estimators</span>
//               <strong className="kpi-val">100 Trees</strong>
//             </div>
//             <div className="kpi-item">
//               <span className="kpi-label">ROC-AUC Score</span>
//               <strong className="kpi-val">0.796</strong>
//             </div>
//             <div className="kpi-item">
//               <span className="kpi-label">Test Accuracy</span>
//               <strong className="kpi-val highlight">{best.accuracy}%</strong>
//             </div>
//           </div>

//           {/* Model Metrics Toggle */}
//           <div className="metrics-section">
//             <div className="metrics-tabs">
//               <button
//                 className={`metrics-tab ${metricTab === "importance" ? "active" : ""}`}
//                 onClick={() => setMetricTab("importance")}
//               >
//                 <Layers size={13} /> Model Benchmarks
//               </button>
//               <button
//                 className={`metrics-tab ${metricTab === "performance" ? "active" : ""}`}
//                 onClick={() => setMetricTab("performance")}
//               >
//                 <TrendingUp size={13} /> Key Predictors
//               </button>
//             </div>

//             {metricTab === "performance" ? (
//               <div className="importance-list">
//                 {FEATURE_IMPORTANCE.slice(0, 4).map((f, i) => (
//                   <div className="importance-item" key={i}>
//                     <div className="importance-meta">
//                       <span className="importance-name">{f.feature}</span>
//                       <span className="importance-score">{(f.importance * 100).toFixed(1)}% weight</span>
//                     </div>
//                     <div className="importance-bar-bg">
//                       <div
//                         className="importance-bar-fill"
//                         style={{ width: `${Math.min(f.importance * 220, 100)}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="benchmark-mini-grid">
//                 {MODEL_BENCHMARKS.map((m, idx) => (
//                   <div className="benchmark-mini-item" key={idx}>
//                     <span className="benchmark-name">{m.name}</span>
//                     <span className="benchmark-score">{m.accuracy}%</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </article>

//         {/* Quick Action & Risk Distribution Column */}
//         <div className="side-column">
//           {/* Quick Assessment CTA */}
//           <article className="card quick-card">
//             <div className="quick-badge">
//               <Activity size={14} />
//               <span>Instant Diagnostic</span>
//             </div>
//             <h3>Patient Risk Scoring</h3>
//             <p>Input patient vitals, cholesterol levels, and lifestyle factors to generate immediate probability scores.</p>
//             <button className="primary-btn quick-btn" onClick={() => setActiveTab("predictor")}>
//               Launch Calculator
//               <ArrowRight size={16} />
//             </button>
//           </article>

//           {/* Cohort Risk Distribution Breakdown */}
//           <article className="card distribution-card">
//             <div className="card-header-sm">
//               <BarChart3 size={16} className="text-indigo" />
//               <h4>Cohort Risk Stratification</h4>
//             </div>
//             <div className="distribution-bars">
//               {distributionData.map((d, i) => (
//                 <div key={i} className="dist-row">
//                   <div className="dist-meta">
//                     <span className="dist-label">{d.label}</span>
//                     <span className="dist-val">{d.value}%</span>
//                   </div>
//                   <div className="dist-bar-bg">
//                     <div className={`dist-bar-fill ${d.tone}`} style={{ width: `${d.value * 2.5}%` }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </article>
//         </div>
//       </section>

//       {/* Recent Evaluations Table & Clinical Features */}
//       <section className="bottom-grid">
//         {/* Recent Evaluations */}
//         <article className="card recent-card">
//           <div className="card-header">
//             <div>
//               <div className="card-subtitle">AUDIT LOG</div>
//               3. Recent Clinical Assessments
//             </div>
//             <div className="table-search">
//               <Search size={13} />
//               <span>Filter records</span>
//             </div>
//           </div>

//           <div className="table-wrapper">
//             <table className="assessment-table">
//               <thead>
//                 <tr>
//                   <th>Patient ID</th>
//                   <th>Demographics</th>
//                   <th>Blood Pressure</th>
//                   <th>Calculated Risk</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentAssessments.map((row) => (
//                   <tr key={row.id}>
//                     <td className="font-mono">{row.id}</td>
//                     <td>{row.age} · {row.gender}</td>
//                     <td>{row.bp} mmHg</td>
//                     <td><strong className="text-dark">{row.risk}</strong></td>
//                     <td>
//                       <span className={`table-badge ${row.level.toLowerCase()}`}>
//                         {row.level}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </article>

//         {/* Clinical Feature Matrix */}
//         <article className="card features-card">
//           <div className="card-header">
//             <div>
//               <div className="card-subtitle">INPUT PARAMETERS</div>
//               3. Measured Clinical Attributes
//             </div>
//             <span className="feature-count">{FEATURE_IMPORTANCE.length} Variables</span>
//           </div>

//           <p className="features-desc">
//             The neural gradient engine measures physical biological factors alongside self-reported lifestyle indicators.
//           </p>

//           <div className="feature-list">
//             {FEATURE_IMPORTANCE.map((f, index) => (
//               <span className="feature-tag" key={index}>
//                 <span className="feature-dot" />
//                 {f.feature}
//               </span>
//             ))}
//           </div>
//         </article>
//       </section>
//     </main>
//   );
// }




// import React from "react";
// import { Users, CheckCircle2, AlertTriangle, Target, ArrowRight } from "lucide-react";
// import { MODEL_BENCHMARKS, FEATURE_IMPORTANCE } from "../data/mlData";
// import "./Dashboard.css";

// export default function Dashboard({ setActiveTab }) {
//   const best = MODEL_BENCHMARKS[0];

//   const stats = [
//     { label: "Total Applications", value: "70,000", sub: "Dataset records", icon: Users, tone: "indigo" },
//     { label: "Low Risk", value: "49.1%", sub: "Predicted safe", icon: CheckCircle2, tone: "green" },
//     { label: "High Risk", value: "50.9%", sub: "Predicted critical", icon: AlertTriangle, tone: "red" },
//     { label: "Model Accuracy", value: `${best.accuracy}%`, sub: "Test set accuracy", icon: Target, tone: "blue" },
//   ];

//   const features = FEATURE_IMPORTANCE.map((f) => f.feature);

//   return (
//     <main className="dashboard">
//       <section className="dashboard-header">
//         <div>
//           <h1>Dashboard</h1>
//           <p>Monitor clinical applications and assess patient risk.</p>
//         </div>

//         <button className="primary-btn" onClick={() => setActiveTab("predictor")}>
//           New Prediction
//           <ArrowRight size={17} />
//         </button>
//       </section>

//       <section className="stats-grid">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;

//           return (
//             <article className="stat-card" key={index}>
//               <div className="stat-content">
//                 <span className="stat-label">{stat.label}</span>
//                 <h2>{stat.value}</h2>
//                 <span className="stat-sub">{stat.sub}</span>
//               </div>

//               <div className={`stat-icon ${stat.tone}`}>
//                 <Icon size={21} />
//               </div>
//             </article>
//           );
//         })}
//       </section>

//       <section className="main-grid">
//         <article className="card model-card">
//           <div className="card-header">
//             <div>
//               <h3>Prediction Model</h3>
//               <p>Current machine learning model</p>
//             </div>

//             <span className="status-badge">
//               <span className="status-dot" />
//               Active
//             </span>
//           </div>

//           <div className="model-info">
//             <div className="model-icon">
//               <Target size={27} />
//             </div>

//             <div>
//               <h4>Gradient Boosting Classifier</h4>
//               <p>Balanced classification model with optimized estimators.</p>
//             </div>
//           </div>

//           <div className="model-details">
//             <div>
//               <span>Algorithm</span>
//               <strong>Gradient Boosting</strong>
//             </div>
//             <div>
//               <span>Estimators</span>
//               <strong>100</strong>
//             </div>
//             <div>
//               <span>Accuracy</span>
//               <strong>{best.accuracy}%</strong>
//             </div>
//           </div>
//         </article>

//         <article className="card quick-card">
//           <div>
//             <h3>Quick Prediction</h3>
//             <p>
//               Enter patient clinical information to determine their
//               cardiovascular risk.
//             </p>
//           </div>

//           <button className="secondary-btn" onClick={() => setActiveTab("predictor")}>
//             Start Prediction
//             <ArrowRight size={17} />
//           </button>
//         </article>
//       </section>

//       <section className="card features-card">
//         <div className="features-header">
//           <h3>Model Features</h3>
//           <p>
//             The prediction model analyzes {features.length} patient and
//             clinical attributes.
//           </p>
//         </div>

//         <div className="feature-list">
//           {features.map((feature, index) => (
//             <span className="feature-tag" key={index}>
//               {feature}
//             </span>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }
