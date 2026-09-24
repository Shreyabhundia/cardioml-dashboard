import React, { useState } from 'react';
import {
  CheckSquare,
  TrendingUp,
  GitBranch,
  BarChart3,
  Sliders,
  Layers,
  Trophy,
  Target,
  Activity,
  Zap,
  Shield,
  Star,
} from 'lucide-react';
import './ModelEvaluation.css';

/* ─── Static mock data matching the cardiovascular dataset ─── */

const CLASS_MODELS = [
  { name: 'Logistic Regression', accuracy: '72.4', precision: '71.8', recall: '73.1', f1: '72.4', best: false },
  { name: 'Decision Tree',       accuracy: '70.9', precision: '70.2', recall: '71.5', f1: '70.8', best: false },
  { name: 'Random Forest',       accuracy: '78.3', precision: '78.0', recall: '78.7', f1: '78.3', best: false },
  { name: 'AdaBoost',            accuracy: '76.1', precision: '75.6', recall: '76.8', f1: '76.2', best: false },
  { name: 'Gradient Boosting',   accuracy: '80.2', precision: '79.8', recall: '80.6', f1: '80.2', best: true  },
];

const REG_MODELS = [
  { name: 'Linear Regression',   rss: '12,840', rmse: '0.428', r2: '0.641', best: false },
  { name: 'Ridge Regression',    rss: '12,610', rmse: '0.424', r2: '0.648', best: false },
  { name: 'Lasso Regression',    rss: '12,790', rmse: '0.427', r2: '0.643', best: false },
  { name: 'Random Forest Reg.',  rss: '10,920', rmse: '0.394', r2: '0.712', best: false },
  { name: 'Gradient Boosting Reg.', rss: '10,140', rmse: '0.379', r2: '0.738', best: true },
];

const CV_FOLDS = [
  { label: 'Fold 1', score: 0.798, pct: 79.8 },
  { label: 'Fold 2', score: 0.804, pct: 80.4 },
  { label: 'Fold 3', score: 0.796, pct: 79.6 },
  { label: 'Fold 4', score: 0.811, pct: 81.1 },
  { label: 'Fold 5', score: 0.801, pct: 80.1 },
];

const PARAMS = [
  'n_estimators', 'max_depth', 'learning_rate', 'min_samples_split',
  'min_samples_leaf', 'max_features', 'subsample', 'n_jobs',
];

const ADV_MODELS = [
  {
    icon: '🌲',
    tone: 'indigo',
    name: 'Random Forest (Bagging)',
    tech: 'Ensemble · Bagging',
    badge: 'both',
    desc: 'Builds multiple decision trees on bootstrapped subsets and averages predictions, reducing variance significantly. Robust to outliers and great for high-dimensional data like cardiovascular risk factors.',
  },
  {
    icon: '🚀',
    tone: 'emerald',
    name: 'AdaBoost',
    tech: 'Ensemble · Boosting',
    badge: 'both',
    desc: 'Sequentially fits weak learners while focusing on previously misclassified samples. Effective for binary classification of cardio disease presence (0/1) and can handle imbalanced classes.',
  },
  {
    icon: '⚡',
    tone: 'amber',
    name: 'Gradient Boosting',
    tech: 'Ensemble · Boosting · Optional',
    badge: 'opt',
    desc: 'Iteratively minimizes a loss function using gradient descent on decision trees. Achieved highest accuracy (80.2%) and R² (0.738) on the cardio dataset — best overall model after tuning.',
  },
];

/* ─── Checklist state keys ─── */
const INIT_CHECKS = {
  acc: false, prec: false, rec: false, f1: false,
  rss: false, rmse: false, r2: false,
  compare_train: false, overfit: false, underfit: false, goodfit: false,
  cv_run: false, cv_avg: false, cv_spread: false,
  compare_table: false, pick_best: false,
  use_grid: false, note_best: false, retest: false,
  rf: false, ada: false, gb: false,
};

export default function ModelEvaluation() {
  const [checks, setChecks] = useState(INIT_CHECKS);

  const toggle = (key) => setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const CheckBox = ({ k }) => (
    <div
      className={`me-check-box ${checks[k] ? 'checked' : ''}`}
      onClick={() => toggle(k)}
      role="checkbox"
      aria-checked={checks[k]}
      tabIndex={0}
      onKeyDown={(e) => e.key === ' ' && toggle(k)}
    />
  );

  const done  = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  const pct   = Math.round((done / total) * 100);

  const avgCV    = (CV_FOLDS.reduce((s, f) => s + f.score, 0) / CV_FOLDS.length).toFixed(3);
  const spreadCV = (Math.max(...CV_FOLDS.map(f => f.score)) - Math.min(...CV_FOLDS.map(f => f.score))).toFixed(3);

  return (
    <div className="me-page animate-fade-up">

      {/* ── Header ── */}
      <div className="me-header">
        <div>
          <div className="me-badge">
            <CheckSquare size={11} /> Task 5 Checklist
          </div>
          <h1>Model Evaluation</h1>
          <p>
            Cardiovascular Disease Dataset · 70,000 records ·
            Both Classification &amp; Regression workflows
          </p>
        </div>

        {/* Legend */}
        <div className="me-legend">
          <span className="legend-pill both">BOTH — do for every model</span>
          <span className="legend-pill class">CLASS — classification only</span>
          <span className="legend-pill reg">REG — regression only</span>
        </div>
      </div>

      {/* ── Progress Banner ── */}
      <div className="me-section">
        <div className="me-results-banner">
          <div className="me-results-banner-text">
            <h3>Checklist Progress</h3>
            <p>
              Track every evaluation step · best model: <strong>Gradient Boosting</strong>
            </p>
          </div>
          <div className="me-results-metrics">
            <div className="me-result-metric">
              <span className="me-result-metric-val">{done}/{total}</span>
              <span className="me-result-metric-label">Steps Done</span>
            </div>
            <div className="me-result-divider" />
            <div className="me-result-metric">
              <span className="me-result-metric-val">{pct}%</span>
              <span className="me-result-metric-label">Complete</span>
            </div>
            <div className="me-result-divider" />
            <div className="me-result-metric">
              <span className="me-result-metric-val">80.2%</span>
              <span className="me-result-metric-label">Best Accuracy</span>
            </div>
            <div className="me-result-divider" />
            <div className="me-result-metric">
              <span className="me-result-metric-val">0.738</span>
              <span className="me-result-metric-label">Best R²</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 1 — Model Evaluation
      ══════════════════════════════════════════════ */}
      <div className="me-section">
        <div className="me-card">
          <p className="me-section-num">Section 01</p>
          <h2 className="me-section-title">
            <span className="me-section-icon purple"><Target size={14} /></span>
            Model Evaluation
          </h2>

          <div className="me-checklist">
            <div className="me-check-item">
              <CheckBox k="acc" />
              <span className="me-check-text">
                Calculate <strong>Accuracy, Precision, Recall, F1-score</strong>
                <span className="ib cls">CLASS</span>
              </span>
            </div>
            <div className="me-check-item">
              <CheckBox k="prec" />
              <span className="me-check-text">
                Calculate <strong>RSS, RMSE, R²</strong>
                <span className="ib reg">REG</span>
              </span>
            </div>
          </div>

          {/* Mini metric explanation */}
          <div className="me-info-boxes" style={{ marginTop: '1rem' }}>
            <div className="me-info-box compare">
              <span className="me-info-box-icon">📊</span>
              <span><strong>Accuracy</strong> — overall correct predictions / total. Use alongside Precision &amp; Recall for imbalanced datasets.</span>
            </div>
            <div className="me-info-box goodfit">
              <span className="me-info-box-icon">📐</span>
              <span><strong>R² (R-squared)</strong> — proportion of variance explained by the model. Closer to 1 = better fit.</span>
            </div>
            <div className="me-info-box overfitting" style={{ gridColumn: '1 / -1' }}>
              <span className="me-info-box-icon">⚠️</span>
              <span><strong>RMSE</strong> penalises large errors more than MAE. <strong>RSS</strong> is the raw sum of squared residuals — lower is always better.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 2 — Check Overfitting / Underfitting
      ══════════════════════════════════════════════ */}
      <div className="me-section">
        <div className="me-card">
          <p className="me-section-num">Section 02</p>
          <h2 className="me-section-title">
            <span className="me-section-icon rose"><Activity size={14} /></span>
            Check Overfitting / Underfitting
          </h2>

          <div className="me-checklist">
            <div className="me-check-item">
              <CheckBox k="compare_train" />
              <span className="me-check-text">
                <strong>Compare Train score vs Test score</strong>
                <span className="ib both">BOTH</span>
              </span>
            </div>
          </div>

          <div className="me-info-boxes">
            <div className="me-info-box overfitting">
              <span className="me-info-box-icon">📈</span>
              <div>
                <div className="me-check-item" style={{ padding: '0', border: 'none', background: 'transparent', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <CheckBox k="overfit" />
                  <strong>Train score much higher than Test score → Overfitting</strong>
                </div>
                Model memorised training data; fails on unseen data. Reduce model complexity or add regularisation.
              </div>
            </div>
            <div className="me-info-box underfitting">
              <span className="me-info-box-icon">📉</span>
              <div>
                <div className="me-check-item" style={{ padding: '0', border: 'none', background: 'transparent', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <CheckBox k="underfit" />
                  <strong>Both scores low → Underfitting</strong>
                </div>
                Model too simple. Increase complexity, add features, or tune hyperparameters.
              </div>
            </div>
            <div className="me-info-box goodfit" style={{ gridColumn: '1 / -1' }}>
              <span className="me-info-box-icon">✅</span>
              <div>
                <div className="me-check-item" style={{ padding: '0', border: 'none', background: 'transparent', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <CheckBox k="goodfit" />
                  <strong>Train and Test scores close → Good fit ✓</strong>
                </div>
                Model generalises well. This is the target state — small gap between train &amp; test performance.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 3 — Cross-Validation
      ══════════════════════════════════════════════ */}
      <div className="me-section">
        <div className="me-card">
          <p className="me-section-num">Section 03</p>
          <h2 className="me-section-title">
            <span className="me-section-icon emerald"><GitBranch size={14} /></span>
            Cross-Validation (5-Fold) OR Bootstrap
          </h2>

          <div className="me-checklist">
            <div className="me-check-item">
              <CheckBox k="cv_run" />
              <span className="me-check-text">
                Run <strong>5-fold (or 10-fold) cross-validation</strong> on the training data
                <span className="ib both">BOTH</span>
              </span>
            </div>
            <div className="me-check-item">
              <CheckBox k="cv_avg" />
              <span className="me-check-text">Note the <strong>average score across folds</strong></span>
            </div>
            <div className="me-check-item">
              <CheckBox k="cv_spread" />
              <span className="me-check-text">Note the <strong>score spread</strong> (high spread = unstable model)</span>
            </div>
          </div>

          {/* CV Results Bars */}
          <div className="me-cv-results">
            {CV_FOLDS.map((f) => (
              <div key={f.label} className="me-cv-row">
                <span className="me-cv-label">{f.label}</span>
                <div className="me-cv-bar-bg">
                  <div className="me-cv-bar-fill" style={{ width: `${f.pct}%` }} />
                </div>
                <span className="me-cv-val">{f.score.toFixed(3)}</span>
              </div>
            ))}
          </div>

          <div className="me-cv-summary">
            <div>
              <div className="me-cv-stat-val">{avgCV}</div>
              <div className="me-cv-stat-label">Average CV Score</div>
            </div>
            <div>
              <div className="me-cv-stat-val">{spreadCV}</div>
              <div className="me-cv-stat-label">Score Spread</div>
            </div>
            <div>
              <div className="me-cv-stat-val" style={{ color: '#059669' }}>Stable</div>
              <div className="me-cv-stat-label">Model Stability</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 4 — Compare All Models
      ══════════════════════════════════════════════ */}
      <div className="me-section">
        <p className="me-section-num">Section 04</p>
        <h2 className="me-section-title" style={{ color: '#0f172a', marginBottom: '1rem' }}>
          <span className="me-section-icon indigo"><BarChart3 size={14} /></span>
          Compare All Models
        </h2>

        <div className="me-check-item" style={{ marginBottom: '1rem' }}>
          <CheckBox k="compare_table" />
          <span className="me-check-text">
            Fill in one table below (Classification OR Regression) for every model tried
          </span>
        </div>

        <div className="me-tables-grid">
          {/* Classification Table */}
          <div className="me-table-card">
            <div className="me-table-head">
              <div className="me-table-head-icon cls">🎯</div>
              <span className="me-table-head-label cls">Classification Models</span>
              <span className="me-table-head-desc">Cardio Disease · Binary</span>
            </div>
            <div className="me-table-wrapper">
              <table className="me-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Accuracy</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1-Score</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASS_MODELS.map((m) => (
                    <tr key={m.name} className={m.best ? 'best-row' : ''}>
                      <td className="model-name-cell">
                        {m.name}
                        {m.best && <span className="best-badge">★ Best</span>}
                      </td>
                      <td className={m.best ? 'highlight-val' : ''}>{m.accuracy}%</td>
                      <td>{m.precision}%</td>
                      <td>{m.recall}%</td>
                      <td className={m.best ? 'highlight-val' : ''}>{m.f1}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regression Table */}
          <div className="me-table-card">
            <div className="me-table-head">
              <div className="me-table-head-icon reg">📉</div>
              <span className="me-table-head-label reg">Regression Models</span>
              <span className="me-table-head-desc">Risk Score · Continuous</span>
            </div>
            <div className="me-table-wrapper">
              <table className="me-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>RSS</th>
                    <th>RMSE</th>
                    <th>R²</th>
                  </tr>
                </thead>
                <tbody>
                  {REG_MODELS.map((m) => (
                    <tr key={m.name} className={m.best ? 'best-row' : ''}>
                      <td className="model-name-cell">
                        {m.name}
                        {m.best && <span className="best-badge">★ Best</span>}
                      </td>
                      <td>{m.rss}</td>
                      <td>{m.rmse}</td>
                      <td className={m.best ? 'highlight-val' : ''}>{m.r2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="me-check-item" style={{ marginTop: '1rem' }}>
          <CheckBox k="pick_best" />
          <span className="me-check-text">
            Pick the model with <strong>best score AND stable cross-validation result</strong>
            <span className="ib both">BOTH</span>
          </span>
        </div>

        <div className="me-select-note">
          <div className="me-select-note-icon">🏆</div>
          <span className="me-select-note-text">
            <strong>Best Model Selected: Gradient Boosting</strong> — achieved 80.2% accuracy (classification)
            and R² = 0.738 (regression) with a stable CV spread of only {spreadCV} across 5 folds.
            Low spread confirms it generalises well to unseen cardiovascular data.
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 5 — Hyperparameter Tuning
      ══════════════════════════════════════════════ */}
      <div className="me-section">
        <div className="me-card">
          <p className="me-section-num">Section 05</p>
          <h2 className="me-section-title">
            <span className="me-section-icon amber"><Sliders size={14} /></span>
            Hyperparameter Tuning
          </h2>

          <div className="me-checklist">
            <div className="me-check-item">
              <CheckBox k="use_grid" />
              <span className="me-check-text">
                Use <strong>GridSearchCV</strong> or <strong>RandomizedSearchCV</strong> on your best model
                <span className="ib both">BOTH</span>
              </span>
            </div>
            <div className="me-check-item">
              <CheckBox k="note_best" />
              <span className="me-check-text">
                Try different values of key settings
                (e.g. <code style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#4f46e5' }}>n_estimators</code>,{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#4f46e5' }}>max_depth</code>,{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#4f46e5' }}>learning_rate</code>)
              </span>
            </div>
            <div className="me-check-item">
              <CheckBox k="retest" />
              <span className="me-check-text">
                Note the <strong>best combination</strong> it finds
              </span>
            </div>
            <div className="me-check-item">
              <CheckBox k="retest" />
              <span className="me-check-text">
                Re-test the tuned model on the test set — <strong>confirm score improved</strong>
                <span className="ib both">BOTH</span>
              </span>
            </div>
          </div>

          {/* Tuning steps */}
          <div className="me-tuning-steps" style={{ marginTop: '1.25rem' }}>
            <div className="me-tuning-step">
              <div className="me-tuning-step-num">1</div>
              <div className="me-tuning-step-body">
                <strong>Define Param Grid</strong>
                <p>Set the range of values for each hyperparameter to search over in GridSearchCV or RandomizedSearchCV.</p>
              </div>
            </div>
            <div className="me-tuning-step">
              <div className="me-tuning-step-num">2</div>
              <div className="me-tuning-step-body">
                <strong>Run Grid / Randomized Search</strong>
                <p>Fit searcher with 5-fold CV on training data. Use scoring="accuracy" for classification, "r2" for regression.</p>
              </div>
            </div>
            <div className="me-tuning-step">
              <div className="me-tuning-step-num">3</div>
              <div className="me-tuning-step-body">
                <strong>Extract Best Params</strong>
                <p>Use <code style={{ fontFamily: 'monospace', color: '#4f46e5' }}>best_estimator_.get_params()</code> to note the winning combination.</p>
              </div>
            </div>
            <div className="me-tuning-step">
              <div className="me-tuning-step-num">4</div>
              <div className="me-tuning-step-body">
                <strong>Re-test on Test Set</strong>
                <p>Apply <code style={{ fontFamily: 'monospace', color: '#4f46e5' }}>best_estimator_</code> to the held-out test set to confirm improvement over baseline.</p>
              </div>
            </div>
          </div>

          {/* Param tags */}
          <div className="me-param-tags">
            {PARAMS.map((p) => (
              <span key={p} className="me-param-tag">
                <span className="me-param-tag-dot" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 6 — Advanced Models
      ══════════════════════════════════════════════ */}
      <div className="me-section">
        <p className="me-section-num">Section 06</p>
        <h2 className="me-section-title" style={{ color: '#0f172a', marginBottom: '1rem' }}>
          <span className="me-section-icon sky"><Layers size={14} /></span>
          Try Advanced Models
        </h2>

        <div className="me-adv-grid">
          {ADV_MODELS.map((m) => {
            const ck = m.name.startsWith('Random') ? 'rf' : m.name.startsWith('Ada') ? 'ada' : 'gb';
            return (
              <div key={m.name} className="me-adv-card">
                <div className="me-adv-card-top">
                  <div className={`me-adv-card-icon ${m.tone}`}>{m.icon}</div>
                  <span className={`me-adv-badge ${m.badge}`}>
                    {m.badge === 'opt' ? 'Optional' : 'BOTH'}
                  </span>
                </div>
                <div className="me-adv-card-name">{m.name}</div>
                <div className="me-adv-card-tech">{m.tech}</div>
                <div className="me-adv-card-desc">{m.desc}</div>
                <div
                  className="me-check-item"
                  style={{ padding: '0.5rem 0.75rem', marginTop: 'auto' }}
                >
                  <CheckBox k={ck} />
                  <span className="me-check-text" style={{ fontSize: '0.75rem' }}>
                    Mark as implemented
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
