import React from 'react';
import {
  Activity,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Printer,
  RotateCcw,
  ChevronRight,
  FileText,
  User,
  Heart,
  Scale,
  Droplets,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './ResultView.css';

export default function ResultView({ result, formData, onReset, setActiveTab }) {
  React.useEffect(() => {
    if (result.riskLevel === 'LOW') {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#88c0a7', '#93b1e6', '#bba8e4', '#e2c293'],
        disableForReducedMotion: true,
      });
    }
  }, [result]);

  const badgeInfo = {
    HIGH: {
      badgeClass: 'badge-high',
      icon: ShieldAlert,
      title: 'Elevated Cardiovascular Risk Detected',
      gaugeClass: 'gauge-high',
      glowClass: 'glow-high',
      borderColor: '#d9777f',
    },
    MODERATE: {
      badgeClass: 'badge-moderate',
      icon: AlertTriangle,
      title: 'Moderate Cardiovascular Risk',
      gaugeClass: 'gauge-moderate',
      glowClass: 'glow-moderate',
      borderColor: '#d9a76c',
    },
    LOW: {
      badgeClass: 'badge-low',
      icon: CheckCircle,
      title: 'Low Cardiovascular Risk',
      gaugeClass: 'gauge-low',
      glowClass: 'glow-low',
      borderColor: '#62a385',
    },
  }[result.riskLevel];

  const IconComponent = badgeInfo.icon;

  const summary = [
    {
      icon: User,
      label: 'Patient Profile',
      value: `${formData.age}y · ${parseInt(formData.gender, 10) === 1 ? 'Female' : 'Male'}`,
    },
    {
      icon: Droplets,
      label: 'Blood Pressure',
      value: `${formData.ap_hi}/${formData.ap_lo} mmHg`,
      sub: result.bpCategory,
    },
    {
      icon: Scale,
      label: 'BMI & Mass',
      value: `${result.bmi} kg/m²`,
      sub: result.bmiCategory,
    },
    {
      icon: Heart,
      label: 'Cholesterol / Glucose',
      value: `Lvl ${formData.cholesterol} / Lvl ${formData.gluc}`,
    },
  ];

  return (
    <div className="result-container">
      {/* Banner */}
      <div
        className={`card banner-card ${badgeInfo.glowClass}`}
        style={{ borderTopColor: badgeInfo.borderColor }}
      >
        <div className="banner-content">
          <div className="banner-header">
            <span className={`pill ${badgeInfo.badgeClass}`}>
              <IconComponent className="icon-sm" />
              {badgeInfo.title}
            </span>
            <h1 className="banner-title">Estimated CVD probability</h1>
            <p className="banner-description">
              Scored by the gradient boosting engine · trained on 68,443 cleaned clinical patient records.
            </p>
          </div>

          {/* Radial Gauge */}
          <div className="gauge-wrapper">
            <svg className="gauge-svg" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="8"
                className="gauge-bg"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={`gauge-fill ${badgeInfo.gaugeClass}`}
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * result.riskPercentage) / 100}
              />
            </svg>
            <div className="gauge-center">
              <span className="gauge-value">{result.riskPercentage}%</span>
              <span className="gauge-label">Risk score</span>
            </div>
          </div>
        </div>

        {/* Summary Chips Grid */}
        <div className="summary-grid">
          {summary.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="summary-chip">
                <div className="summary-chip-header">
                  <Icon className="icon-xs" />
                  {item.label}
                </div>
                <div className="summary-chip-value">{item.value}</div>
                {item.sub && <div className="summary-chip-sub">{item.sub}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drivers & Advice Section */}
      <div className="drivers-advice-grid">
        {/* Risk Drivers Card */}
        <div className="card details-card">
          <div className="details-header">
            <div className="details-header-left">
              <div className="icon-box soft-indigo">
                <Activity className="icon-md" />
              </div>
              <h3 className="details-title">Primary Risk Drivers</h3>
            </div>
            <span className="details-hint">Decision factors</span>
          </div>

          <div className="details-body">
            {result.contributors.length === 0 ? (
              <p className="empty-text">
                No elevated risk factors identified. Keep up the good habits!
              </p>
            ) : (
              result.contributors.map((item, idx) => (
                <div key={idx} className="contributor-item">
                  <div className="contributor-info">
                    <div className="contributor-name">{item.feature}</div>
                    <div className="contributor-val">
                      Value: <strong>{item.val}</strong>
                    </div>
                  </div>
                  <span
                    className={`pill ${
                      item.level === 'high'
                        ? 'pill-high'
                        : item.level === 'protective'
                        ? 'pill-protective'
                        : 'pill-moderate'
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended Actions Card */}
        <div className="card details-card">
          <div className="details-header">
            <div className="details-header-left">
              <div className="icon-box soft-emerald">
                <FileText className="icon-md" />
              </div>
              <h3 className="details-title">Recommended Next Steps</h3>
            </div>
          </div>

          <ul className="recommendation-list">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="recommendation-item">
                <span className="check-icon-wrapper">
                  <CheckCircle className="icon-xs" />
                </span>
                <span className="recommendation-text">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="actions-bar">
        <button onClick={onReset} className="btn btn-outline">
          <RotateCcw className="icon-md" />
          Modify Inputs
        </button>

        <div className="actions-right">
          <button onClick={() => window.print()} className="btn btn-outline">
            <Printer className="icon-md text-indigo" />
            Print Report
          </button>
          <button onClick={() => setActiveTab('predictor')} className="btn btn-primary">
            Run Another Assessment
            <ChevronRight className="icon-md" />
          </button>
        </div>
      </div>
    </div>
  );
}