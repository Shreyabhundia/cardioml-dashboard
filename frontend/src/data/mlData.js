// CardioPulse AI - Notebook & SOP Empirical ML Dataset & Model Specifications

export const DATASET_METRICS = {
  rawRecords: 70000,
  cleanedRecords: 68443,
  removedOutliers: 1557,
  outlierPercentage: "2.22%",
  featuresCount: 12,
  targetVariable: "cardio (0 = No CVD, 1 = Presence of CVD)",
  datasetSource: "Sulianova Kaggle Cardiovascular Dataset",
  academicSOP: "Darshan University CE Department ML Project SOP (Weeks 1-10)",
};

export const MODEL_BENCHMARKS = [
  {
    name: "Gradient Boosting Classifier",
    category: "Ensemble Boosting (Best Model)",
    accuracy: 73.4,
    f1Score: 71.7,
    rocAuc: 0.797,
    precision: 73.1,
    recall: 70.4,
    scratchVsLib: "Library (scikit-learn)",
    isBest: true,
    hyperparameters: {
      n_estimators: 300,
      learning_rate: 0.05,
      max_depth: 4,
      min_samples_leaf: 3,
      subsample: 0.8,
    },
  },
  {
    name: "Random Forest Classifier",
    category: "Ensemble Bagging",
    accuracy: 72.1,
    f1Score: 70.8,
    rocAuc: 0.781,
    precision: 71.8,
    recall: 69.8,
    scratchVsLib: "Library (scikit-learn)",
    isBest: false,
    hyperparameters: {
      n_estimators: 200,
      max_depth: 10,
      min_samples_split: 5,
    },
  },
  {
    name: "Logistic Regression",
    category: "Linear Probabilistic",
    accuracy: 72.5,
    f1Score: 70.9,
    rocAuc: 0.778,
    precision: 72.1,
    recall: 69.8,
    scratchVsLib: "Library (scikit-learn)",
    isBest: false,
    hyperparameters: {
      C: 1.0,
      solver: "lbfgs",
      max_iter: 1000,
    },
  },
  {
    name: "Scratch Implementation",
    category: "Custom Gradient Descent (SOP Mandatory)",
    accuracy: 71.8,
    f1Score: 70.0,
    rocAuc: 0.769,
    precision: 70.9,
    recall: 69.1,
    scratchVsLib: "From-Scratch (No Library)",
    isBest: false,
    hyperparameters: {
      learning_rate: 0.01,
      epochs: 1000,
      loss_function: "Binary Cross-Entropy",
      optimization: "Gradient Descent",
    },
  },
  {
    name: "Naïve Bayes Classifier",
    category: "Probabilistic Gaussian",
    accuracy: 71.2,
    f1Score: 68.7,
    rocAuc: 0.762,
    precision: 73.1,
    recall: 64.9,
    scratchVsLib: "Library (scikit-learn)",
    isBest: false,
    hyperparameters: {
      var_smoothing: 1e-9,
    },
  },
  {
    name: "K-Nearest Neighbors (KNN)",
    category: "Distance-Based Instance",
    accuracy: 70.2,
    f1Score: 69.1,
    rocAuc: 0.745,
    precision: 69.5,
    recall: 68.8,
    scratchVsLib: "Library (scikit-learn)",
    isBest: false,
    hyperparameters: {
      n_neighbors: 15,
      weights: "distance",
      metric: "minkowski",
    },
  },
  {
    name: "Decision Tree Classifier",
    category: "Non-Linear Rule Tree",
    accuracy: 63.8,
    f1Score: 63.3,
    rocAuc: 0.637,
    precision: 63.5,
    recall: 63.2,
    scratchVsLib: "Library (scikit-learn)",
    isBest: false,
    hyperparameters: {
      criterion: "gini",
      max_depth: null,
      min_samples_split: 2,
    },
  },
];

export const FEATURE_IMPORTANCE = [
  { feature: "ap_hi (Systolic BP)", importance: 68.9, key: "ap_hi", description: "Primary indicator of intra-arterial cardiac workload" },
  { feature: "age (Patient Age)", importance: 12.8, key: "age", description: "Vascular stiffness increases progressively past age 45" },
  { feature: "cholesterol", importance: 6.5, key: "cholesterol", description: "Atherosclerotic plaque accumulation index" },
  { feature: "weight / BMI", importance: 5.2, key: "bmi", description: "Systemic metabolic load & adiposity coefficient" },
  { feature: "ap_lo (Diastolic BP)", importance: 3.1, key: "ap_lo", description: "Resting arterial resistance during ventricular relaxation" },
  { feature: "gluc (Glucose Level)", importance: 1.8, key: "gluc", description: "Endothelial inflammation and glycemic status" },
  { feature: "active (Physical Activity)", importance: 1.1, key: "active", description: "Cardioprotective exercise frequency threshold" },
  { feature: "smoke (Smoking Status)", importance: 0.4, key: "smoke", description: "Vascular endothelial oxidative damage" },
  { feature: "alco (Alcohol Intake)", importance: 0.2, key: "alco", description: "Hepatic & hypertension lifestyle modifier" },
];

export const EDA_STATS = {
  ageMeanNonCvd: 51.2,
  ageMeanCvd: 54.5,
  overallMeanAge: 53.3,
  
  ageDistribution: [
    { ageGroup: "35-40", total: 4200, cvdCount: 1100, cvdRate: 26.2 },
    { ageGroup: "41-45", total: 8500, cvdCount: 2900, cvdRate: 34.1 },
    { ageGroup: "46-50", total: 14200, cvdCount: 6100, cvdRate: 43.0 },
    { ageGroup: "51-55", total: 18600, cvdCount: 9500, cvdRate: 51.1 },
    { ageGroup: "56-60", total: 16100, cvdCount: 9700, cvdRate: 60.2 },
    { ageGroup: "61-65", total: 8400, cvdCount: 5700, cvdRate: 67.9 },
  ],

  bpCategories: [
    { category: "Normal (<120/80)", cvdRate: 24.1, count: 21400 },
    { category: "Elevated (120-129/<80)", cvdRate: 41.5, count: 12100 },
    { category: "Stage 1 (130-139/80-89)", cvdRate: 58.8, count: 18300 },
    { category: "Stage 2 (≥140/≥90)", cvdRate: 79.4, count: 16643 },
  ],

  cholesterolPrevalence: [
    { level: "Normal (1)", cvdRate: 44.0, count: 52385 },
    { level: "Above Normal (2)", cvdRate: 60.2, count: 9549 },
    { level: "Well Above Normal (3)", cvdRate: 76.5, count: 8066 },
  ],

  glucosePrevalence: [
    { level: "Normal (1)", cvdRate: 48.1, count: 59579 },
    { level: "Above Normal (2)", cvdRate: 59.3, count: 5190 },
    { level: "Well Above Normal (3)", cvdRate: 62.4, count: 5231 },
  ],
};

export const PRESET_PROFILES = [
  {
    id: "low_risk",
    name: "Athlete / Low Risk Profile",
    badge: "Low Risk (~12%)",
    color: "emerald",
    data: {
      age: 34,
      gender: 1, // Female
      height: 168,
      weight: 58,
      ap_hi: 112,
      ap_lo: 74,
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1,
    },
    note: "Young adult, optimal BP, ideal BMI (20.5), non-smoker, physically active."
  },
  {
    id: "moderate_risk",
    name: "Mid-Life Moderate Risk Profile",
    badge: "Moderate Risk (~48%)",
    color: "amber",
    data: {
      age: 52,
      gender: 2, // Male
      height: 175,
      weight: 83,
      ap_hi: 136,
      ap_lo: 88,
      cholesterol: 2,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 0,
    },
    note: "52yo male, Stage 1 Hypertension, elevated cholesterol, sedentary lifestyle."
  },
  {
    id: "high_risk",
    name: "High Clinical Risk Profile",
    badge: "High Risk (~89%)",
    color: "crimson",
    data: {
      age: 61,
      gender: 2, // Male
      height: 170,
      weight: 96,
      ap_hi: 162,
      ap_lo: 98,
      cholesterol: 3,
      gluc: 2,
      smoke: 1,
      alco: 0,
      active: 0,
    },
    note: "61yo male, Stage 2 severe hypertension, obesity (BMI 33.2), high cholesterol, active smoker."
  }
];

export const SOP_PIPELINE = [
  { week: "Week 1", title: "Problem Definition & Dataset Exploration", desc: "Explored Sulianova 70k Kaggle dataset, validated feature dtypes, checked zero-null status, and analyzed target balance." },
  { week: "Week 2", title: "Data Preprocessing & Outlier Filtering", desc: "Removed 1,557 invalid outliers (systolic BP < 50 or > 240, height < 120cm). Formatted age in days to years." },
  { week: "Week 3", title: "Scratch Algorithm Implementation", desc: "Mandatory SOP Constraint: Built Gradient Descent Logistic Classification from math scratch without ML library." },
  { week: "Week 4", title: "Model Evaluation & Benchmarking", desc: "Computed Accuracy, Precision, Recall, F1 Score, and ROC-AUC on holdout test set. Checked overfitting/underfitting." },
  { week: "Week 5", title: "Advanced Model Training & Hyperparameter Tuning", desc: "Evaluated Gradient Boosting, Random Forest, XGBoost with GridSearchCV hyperparameter optimization." },
  { week: "Week 6", title: "Visualization & Metric Graphing", desc: "Generated feature importance charts, confusion matrix heatmaps, ROC curves, and cross-validation variance charts." },
  { week: "Weeks 7-10", title: "Interactive UI & Web Deployment", desc: "Constructed premium React clinical dashboard with real-time ML inference engine and full research transparency." },
];
