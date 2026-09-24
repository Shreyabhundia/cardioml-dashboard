import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  X,
  User,
  Activity,
  Heart,
  TrendingUp,
  FileText,
  Calendar,
  Phone,
  ShieldAlert,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import "./PatientDirectory.css";

// Sample Patient Cohort Dataset
const INITIAL_PATIENTS = [
  {
    id: "PX-9042",
    name: "Eleanor Vance",
    age: 54,
    gender: "Female",
    riskTier: "Low",
    riskScore: 12,
    bp: "138/88",
    chol: 198,
    bmi: 24.2,
    smoker: false,
    dateAdded: "2026-08-14",
    phone: "+1 (555) 234-5678",
    history: [
      { date: "2026-02-10", sysBP: 142, chol: 210, risk: 16 },
      { date: "2026-05-18", sysBP: 140, chol: 204, risk: 14 },
      { date: "2026-08-14", sysBP: 138, chol: 198, risk: 12 },
    ],
  },
  {
    id: "PX-9041",
    name: "Marcus Thorne",
    age: 61,
    gender: "Male",
    riskTier: "Critical",
    riskScore: 84,
    bp: "162/95",
    chol: 265,
    bmi: 31.8,
    smoker: true,
    dateAdded: "2026-08-20",
    phone: "+1 (555) 876-5432",
    history: [
      { date: "2026-01-15", sysBP: 155, chol: 240, risk: 72 },
      { date: "2026-04-22", sysBP: 158, chol: 252, risk: 78 },
      { date: "2026-08-20", sysBP: 162, chol: 265, risk: 84 },
    ],
  },
  {
    id: "PX-9040",
    name: "Sophia Chen",
    age: 48,
    gender: "Female",
    riskTier: "Moderate",
    riskScore: 34,
    bp: "128/82",
    chol: 220,
    bmi: 26.5,
    smoker: false,
    dateAdded: "2026-08-25",
    phone: "+1 (555) 345-6789",
    history: [
      { date: "2026-03-01", sysBP: 132, chol: 228, risk: 38 },
      { date: "2026-08-25", sysBP: 128, chol: 220, risk: 34 },
    ],
  },
  {
    id: "PX-9039",
    name: "Arthur Pendelton",
    age: 67,
    gender: "Male",
    riskTier: "High",
    riskScore: 71,
    bp: "154/90",
    chol: 242,
    bmi: 29.1,
    smoker: true,
    dateAdded: "2026-09-01",
    phone: "+1 (555) 987-6543",
    history: [
      { date: "2026-05-10", sysBP: 150, chol: 235, risk: 65 },
      { date: "2026-09-01", sysBP: 154, chol: 242, risk: 71 },
    ],
  },
  {
    id: "PX-9038",
    name: "Clara Sterling",
    age: 39,
    gender: "Female",
    riskTier: "Low",
    riskScore: 8,
    bp: "118/76",
    chol: 175,
    bmi: 21.4,
    smoker: false,
    dateAdded: "2026-09-03",
    phone: "+1 (555) 456-7890",
    history: [
      { date: "2026-09-03", sysBP: 118, chol: 175, risk: 8 },
    ],
  },
];

export default function PatientDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filtered Cohort Calculation
  const filteredPatients = useMemo(() => {
    return INITIAL_PATIENTS.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk =
        selectedRisk === "All" || patient.riskTier.toLowerCase() === selectedRisk.toLowerCase();
      const matchesGender =
        selectedGender === "All" || patient.gender.toLowerCase() === selectedGender.toLowerCase();

      return matchesSearch && matchesRisk && matchesGender;
    });
  }, [searchTerm, selectedRisk, selectedGender]);

  return (
    <div className="directory-container">
      {/* Header Bar */}
      <div className="directory-header">
        <div>
          <div className="directory-badge">
            <User size={12} />
            <span>Active Clinical Cohort</span>
          </div>
          <h1>Patient Directory</h1>
          <p>Search, filter, and review longitudinal patient risk trends.</p>
        </div>

        <button className="export-all-btn">
          <Download size={15} />
          Export Cohort Data
        </button>
      </div>

      {/* Control Bar (Filters & Search) */}
      <div className="controls-card">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Patient Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-group">
          <div className="filter-select-wrapper">
            <SlidersHorizontal size={14} className="filter-icon" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Risk Tiers</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <Filter size={14} className="filter-icon" />
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-card">
        <table className="cohort-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Full Name</th>
              <th>Age / Gender</th>
              <th>Blood Pressure</th>
              <th>Cholesterol</th>
              <th>Risk Score</th>
              <th>Risk Status</th>
              <th>Date Enrolled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className={selectedPatient?.id === patient.id ? "row-selected" : ""}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="font-mono">{patient.id}</td>
                  <td className="patient-name">{patient.name}</td>
                  <td>
                    {patient.age}y · {patient.gender}
                  </td>
                  <td>{patient.bp} mmHg</td>
                  <td>{patient.chol} mg/dL</td>
                  <td>
                    <div className="score-cell">
                      <div className="score-bar-bg">
                        <div
                          className={`score-bar-fill ${patient.riskTier.toLowerCase()}`}
                          style={{ width: `${patient.riskScore}%` }}
                        />
                      </div>
                      <span className="score-value">{patient.riskScore}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${patient.riskTier.toLowerCase()}`}>
                      {patient.riskTier}
                    </span>
                  </td>
                  <td>{patient.dateAdded}</td>
                  <td>
                    <button className="row-action-btn">
                      <span>View</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">
                  No patient records match the applied criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Profile Drawer */}
      {selectedPatient && (
        <div className="drawer-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="drawer-header">
              <div className="patient-hero">
                <div className="avatar-box">
                  <User size={24} />
                </div>
                <div>
                  <h2>{selectedPatient.name}</h2>
                  <p>
                    {selectedPatient.id} • {selectedPatient.gender}, {selectedPatient.age} years
                  </p>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setSelectedPatient(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Risk Overview Card */}
              <div className="drawer-card risk-highlight">
                <div className="risk-card-left">
                  <span className="drawer-card-label">Predicted Cardiovascular Risk</span>
                  <div className="risk-score-large">{selectedPatient.riskScore}%</div>
                  <span className={`status-pill ${selectedPatient.riskTier.toLowerCase()}`}>
                    {selectedPatient.riskTier} Risk Classification
                  </span>
                </div>
                <ShieldAlert size={36} className={`risk-icon-bg ${selectedPatient.riskTier.toLowerCase()}`} />
              </div>

              {/* Vitals Summary */}
              <div className="drawer-section">
                <h3>Current Baseline Vitals</h3>
                <div className="vitals-grid">
                  <div className="vital-item">
                    <Heart size={16} className="text-rose" />
                    <div>
                      <span className="vital-label">Blood Pressure</span>
                      <strong className="vital-val">{selectedPatient.bp}</strong>
                    </div>
                  </div>
                  <div className="vital-item">
                    <Activity size={16} className="text-amber" />
                    <div>
                      <span className="vital-label">Cholesterol</span>
                      <strong className="vital-val">{selectedPatient.chol} mg/dL</strong>
                    </div>
                  </div>
                  <div className="vital-item">
                    <User size={16} className="text-indigo" />
                    <div>
                      <span className="vital-label">Body Mass Index</span>
                      <strong className="vital-val">{selectedPatient.bmi}</strong>
                    </div>
                  </div>
                  <div className="vital-item">
                    <Phone size={16} className="text-sky" />
                    <div>
                      <span className="vital-label">Smoker Flag</span>
                      <strong className="vital-val">
                        {selectedPatient.smoker ? "Active Smoker" : "Non-Smoker"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Longitudinal History Chart / List */}
              <div className="drawer-section">
                <div className="section-title-row">
                  <h3>Historical Risk Progression</h3>
                  <TrendingUp size={16} className="text-indigo" />
                </div>
                <div className="history-list">
                  {selectedPatient.history.map((record, index) => (
                    <div className="history-row" key={index}>
                      <div className="history-date">
                        <Calendar size={13} />
                        <span>{record.date}</span>
                      </div>
                      <div className="history-metrics">
                        <span>BP: <strong>{record.sysBP} mmHg</strong></span>
                        <span>Chol: <strong>{record.chol}</strong></span>
                      </div>
                      <div className="history-risk">
                        <span>Risk: <strong>{record.risk}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="drawer-section">
                <h3>Contact Information</h3>
                <div className="contact-card">
                  <Phone size={14} />
                  <span>{selectedPatient.phone}</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="drawer-footer">
              <button className="primary-btn drawer-btn">
                <FileText size={15} />
                Generate Patient Summary (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}