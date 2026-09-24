import React from "react";
import {
  Activity,
  HeartPulse,
  LayoutDashboard,
  Presentation,
  ArrowUpRight,
} from "lucide-react";

import "./Navbar.css";

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "predictor",
    label: "Risk Predictor",
    icon: HeartPulse,
  },
  {
    id: "result",
    label: "Results",
    icon: Presentation,
  },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  hasResult,
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* ================= HEADER ================= */}
        <div className="navbar-main">

          {/* ---------- BRAND ---------- */}
          <button
            type="button"
            className="navbar-brand"
            onClick={() => setActiveTab("overview")}
          >
            <div className="brand-icon">
              <Activity
                size={22}
                className="heartbeat-icon"
              />
            </div>

            <div className="brand-text">
              <div className="brand-name">
                Cardio<span>ML</span>
              </div>

              <div className="brand-subtitle">
                Clinical Risk Engine
              </div>
            </div>
          </button>


          {/* ---------- DESKTOP NAV ---------- */}
          <nav className="desktop-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              const isActive =
                activeTab === item.id;

              const isDisabled =
                item.id === "result" && !hasResult;

              return (
                <button
                  type="button"
                  key={item.id}
                  disabled={isDisabled}
                  onClick={() => setActiveTab(item.id)}
                  className={`nav-item ${
                    isActive ? "active" : ""
                  } ${
                    isDisabled ? "disabled" : ""
                  }`}
                >
                  <Icon size={15} />

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>


          {/* ---------- DESKTOP CTA ---------- */}
          <button
            type="button"
            className="assessment-button desktop-button"
            onClick={() =>
              setActiveTab("predictor")
            }
          >
            <HeartPulse size={15} />

            <span>
              Start Assessment
            </span>

            <ArrowUpRight size={15} />
          </button>


          {/* ---------- MOBILE CTA ---------- */}
          <button
            type="button"
            className="assessment-button mobile-button"
            onClick={() =>
              setActiveTab("predictor")
            }
          >
            <HeartPulse size={16} />

            <span>
              Predict
            </span>
          </button>

        </div>


        {/* ================= MOBILE NAV ================= */}
        <nav className="mobile-nav">

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeTab === item.id;

            const isDisabled =
              item.id === "result" && !hasResult;

            return (
              <button
                type="button"
                key={item.id}
                disabled={isDisabled}
                onClick={() =>
                  setActiveTab(item.id)
                }
                className={`mobile-nav-item ${
                  isActive ? "active" : ""
                } ${
                  isDisabled ? "disabled" : ""
                }`}
              >
                <Icon size={14} />

                <span>
                  {item.label}
                </span>
              </button>
            );
          })}

        </nav>

      </div>
    </header>
  );
}