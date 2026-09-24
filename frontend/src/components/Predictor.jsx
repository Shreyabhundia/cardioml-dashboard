import React, { useState } from 'react';
import {
  Activity,
  User,
  Heart,
  Flame,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Check,
  Gauge,
} from 'lucide-react';
import { PRESET_PROFILES } from '../data/mlData';
import { calculateCardioRisk } from '../utils/mlInference';
import { DEFAULT_FORM } from '../constants';
import './Predictor.css';

function CardHead({ icon, tint, title, hint }) {
  return (
    <div className="card-head">
      <div className={`icon-badge tint-${tint}`}>{icon}</div>
      <div>
        <h3 className="card-head-title">{title}</h3>
        {hint && <span className="card-head-hint">{hint}</span>}
      </div>
    </div>
  );
}

function SegGroup({ name, value, options, onChange }) {
  return (
    <div className="seg-group">
      {options.map((opt) => {
        const isSelected = parseInt(value, 10) === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isSelected}
            className={`seg-btn ${isSelected ? 'active' : ''}`}
            onClick={() => onChange({ target: { name, value: opt.value } })}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Predictor({ formData, setFormData, onCalculate, activePreset, setActivePreset }) {
  const h = parseFloat(formData.height) || 165;
  const w = parseFloat(formData.weight) || 70;
  const bmi = (w / Math.pow(h / 100, 2)).toFixed(1);

  const apHi = parseFloat(formData.ap_hi) || 120;
  const apLo = parseFloat(formData.ap_lo) || 80;

  let bpWarning = '';
  if (apLo >= apHi) {
    bpWarning = 'Diastolic BP (ap_lo) cannot be equal to or higher than Systolic BP (ap_hi).';
  } else if (apHi < 70 || apHi > 240) {
    bpWarning = 'Systolic BP (ap_hi) is outside clinical bounds (70–240 mmHg).';
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setActivePreset(null);
  };

  const handleSelectPreset = (profile) => {
    setFormData(profile.data);
    setActivePreset(profile.id);
  };

  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null); // null | 'api' | 'fallback'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        age:         parseFloat(formData.age),
        gender:      parseInt(formData.gender, 10),
        height:      parseFloat(formData.height),
        weight:      parseFloat(formData.weight),
        ap_hi:       parseFloat(formData.ap_hi),
        ap_lo:       parseFloat(formData.ap_lo),
        cholesterol: parseInt(formData.cholesterol, 10),
        gluc:        parseInt(formData.gluc, 10),
        smoke:       parseInt(formData.smoke, 10),
        alco:        parseInt(formData.alco, 10),
        active:      parseInt(formData.active, 10),
      };
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setApiStatus('api');
      onCalculate(data);
    } catch {
      // Fallback to client-side inference if API is unreachable
      setApiStatus('fallback');
      onCalculate(calculateCardioRisk(formData));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM);
    setActivePreset(null);
  };

  const getBmiClass = () => {
    if (bmi >= 25) return 'bmi-warning';
    if (bmi < 18.5) return 'bmi-info';
    return 'bmi-success';
  };

  return (
    <div className="predictor-container">
      {/* Header Section */}
      <div className="predictor-header">
        <span className="pill header-pill">
          <Activity className="icon-sm" />
          Cardiovascular Risk Assessment
        </span>
        <h1 className="header-title">Enter clinical parameters</h1>
        <p className="header-description">
          Biological, hemodynamic, and lifestyle inputs are scored by the gradient boosting engine
          to estimate your CVD probability.
        </p>
      </div>

      {/* Preset Profiles / Fast Test-Drive */}
      <div className="card preset-card">
        <div className="preset-header">
          <span className="preset-title">Fast test-drive</span>
          <span className="preset-subtitle">Click a profile to pre-fill realistic clinical data</span>
        </div>
        <div className="preset-grid">
          {PRESET_PROFILES.map((profile) => {
            const isSelected = activePreset === profile.id;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleSelectPreset(profile)}
                className={`preset-button ${isSelected ? 'selected' : ''}`}
              >
                {isSelected && (
                  <span className="check-badge">
                    <Check className="icon-xs" />
                  </span>
                )}
                <span className={`pill profile-tone-${profile.color}`}>{profile.badge}</span>
                <div className="profile-name">{profile.name}</div>
                <div className="profile-note">{profile.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="predictor-form">
        <div className="form-grid-top">
          {/* Demographics Card */}
          <div className="card form-card">
            <CardHead
              icon={<User className="icon-md" />}
              tint="demographics"
              title="Demographics & Biometrics"
              hint="Age, sex and body measures"
            />

            <div className="form-fields">
              {/* Age Slider */}
              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label">Age (Years)</label>
                  <span className="field-value-indigo">{formData.age} yrs</span>
                </div>
                <input
                  type="range"
                  name="age"
                  min="25"
                  max="80"
                  value={formData.age}
                  onChange={handleChange}
                  className="range-input"
                />
                <div className="range-ticks">
                  <span>25</span>
                  <span>50</span>
                  <span>80</span>
                </div>
              </div>

              {/* Gender Selector */}
              <div className="field-group">
                <label className="field-label">Biological Gender</label>
                <SegGroup
                  name="gender"
                  value={formData.gender}
                  options={[
                    { value: 1, label: 'Female (1)' },
                    { value: 2, label: 'Male (2)' },
                  ]}
                  onChange={handleChange}
                />
              </div>

              {/* Height & Weight Inputs */}
              <div className="field-row-two">
                <div className="field-group">
                  <label className="field-label">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    min="120"
                    max="220"
                    value={formData.height}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    min="30"
                    max="180"
                    value={formData.weight}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>

              {/* Computed BMI Display */}
              <div className="bmi-display border-box">
                <span className="bmi-label">Computed BMI</span>
                <span className={`bmi-value ${getBmiClass()}`}>{bmi} kg/m²</span>
              </div>
            </div>
          </div>

          {/* Hemodynamics Card */}
          <div className="card form-card">
            <CardHead
              icon={<Heart className="icon-md" />}
              tint="hemody"
              title="Hemodynamics & Blood Markers"
              hint="Blood pressure, cholesterol, glucose"
            />

            {bpWarning && (
              <div className="warning-banner">
                <AlertTriangle className="icon-md warning-icon" />
                <span className="warning-text">{bpWarning}</span>
              </div>
            )}

            <div className="form-fields">
              {/* Systolic BP Slider */}
              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label">Systolic Blood Pressure (ap_hi)</label>
                  <span className="field-value-rose">{formData.ap_hi} mmHg</span>
                </div>
                <input
                  type="range"
                  name="ap_hi"
                  min="80"
                  max="220"
                  value={formData.ap_hi}
                  onChange={handleChange}
                  className="range-input"
                />
                <div className="range-ticks">
                  <span>80 Low</span>
                  <span>120 Normal</span>
                  <span>160 High</span>
                  <span>220 Crisis</span>
                </div>
              </div>

              {/* Diastolic BP Slider */}
              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label">Diastolic Blood Pressure (ap_lo)</label>
                  <span className="field-value-blue">{formData.ap_lo} mmHg</span>
                </div>
                <input
                  type="range"
                  name="ap_lo"
                  min="50"
                  max="140"
                  value={formData.ap_lo}
                  onChange={handleChange}
                  className="range-input"
                />
                <div className="range-ticks">
                  <span>50 Low</span>
                  <span>80 Normal</span>
                  <span>100 Elevated</span>
                  <span>140 High</span>
                </div>
              </div>

              {/* Cholesterol Level Select */}
              <div className="field-group">
                <label className="field-label">Cholesterol Level</label>
                <select
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  className="field-input"
                >
                  <option value={1}>Level 1 — Normal (&lt; 200 mg/dL)</option>
                  <option value={2}>Level 2 — Above Normal (200–239 mg/dL)</option>
                  <option value={3}>Level 3 — Well Above Normal (≥ 240 mg/dL)</option>
                </select>
              </div>

              {/* Glucose Level Select */}
              <div className="field-group">
                <label className="field-label">Glucose Level</label>
                <select
                  name="gluc"
                  value={formData.gluc}
                  onChange={handleChange}
                  className="field-input"
                >
                  <option value={1}>Level 1 — Normal (&lt; 100 mg/dL)</option>
                  <option value={2}>Level 2 — Above Normal (100–125 mg/dL)</option>
                  <option value={3}>Level 3 — Well Above Normal (≥ 126 mg/dL)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Lifestyle + Summary Panel */}
        <div className="form-grid-bottom">
          {/* Lifestyle Card */}
          <div className="card form-card lifestyle-card">
            <CardHead
              icon={<Flame className="icon-md" />}
              tint="lifestyle"
              title="Lifestyle & Habits"
              hint="Modifiable behavior factors"
            />

            <div className="form-fields">
              <div className="field-group">
                <label className="field-label">Smoking Status</label>
                <SegGroup
                  name="smoke"
                  value={formData.smoke}
                  options={[
                    { value: 0, label: 'Non-smoker' },
                    { value: 1, label: 'Smoker' },
                  ]}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Alcohol Intake</label>
                <SegGroup
                  name="alco"
                  value={formData.alco}
                  options={[
                    { value: 0, label: 'None' },
                    { value: 1, label: 'Regular' },
                  ]}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Physical Activity</label>
                <SegGroup
                  name="active"
                  value={formData.active}
                  options={[
                    { value: 1, label: 'Active (≥150m/wk)' },
                    { value: 0, label: 'Inactive' },
                  ]}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Sticky Live Summary Panel */}
          <div className="card summary-card">
            <div className="card-head">
              <div className="icon-badge tint-demographics">
                <Gauge className="icon-md" />
              </div>
              <div>
                <h3 className="card-head-title">Live Summary</h3>
                <span className="card-head-hint">Computed in the browser</span>
              </div>
            </div>

            <div className="summary-list">
              <div className="summary-row">
                <span className="summary-key">Profile</span>
                <span className="summary-value">
                  {formData.age}y · {parseInt(formData.gender, 10) === 1 ? 'Female' : 'Male'}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Body Mass Index</span>
                <span className="summary-value">{bmi} kg/m²</span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Blood Pressure</span>
                <span className="summary-value">
                  {formData.ap_hi}/{formData.ap_lo} mmHg
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Cholesterol / Glucose</span>
                <span className="summary-value">
                  Lvl {formData.cholesterol} / Lvl {formData.gluc}
                </span>
              </div>
            </div>

            <div className="summary-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Activity className={`icon-md ${loading ? 'animate-spin' : 'animate-pulse'}`} />
                <span>{loading ? 'Computing…' : 'Compute CVD Risk'}</span>
                {!loading && <ArrowRight className="icon-md" />}
              </button>
              <button type="button" onClick={handleReset} className="btn btn-ghost" disabled={loading}>
                <RotateCcw className="icon-sm" />
                <span>Reset Inputs</span>
              </button>
            </div>
            {apiStatus === 'api' && (
              <p className="summary-disclaimer" style={{color:'#4ade80'}}>✓ Scored by live ML model (GradientBoosting)</p>
            )}
            {apiStatus === 'fallback' && (
              <p className="summary-disclaimer" style={{color:'#f59e0b'}}>⚠ API offline — using client-side inference</p>
            )}

            <p className="summary-disclaimer">
              Estimates are for research and educational purposes only — not a medical diagnosis.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}