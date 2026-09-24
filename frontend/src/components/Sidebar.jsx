import React from 'react';
import { LayoutDashboard, FileBarChart, Calculator, Users, FlaskConical } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patient Directory', icon: Users },
  { id: 'predictor', label: 'Risk Prediction', icon: Calculator },
  { id: 'result', label: 'Results', icon: FileBarChart },
  { id: 'model-eval', label: 'Model Evaluation', icon: FlaskConical },
];

export default function Sidebar({ activeTab, setActiveTab, hasResult }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <div className="brand-logo-icon">
            <span className="brand-logo-bars">|||</span>
          </div>
        </div>
        <div className="brand-text">
          <h1 className="brand-title">CardioML</h1>
          <p className="brand-subtitle">AI Risk Analysis</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-content">
        <div className="nav-group">
          <p className="nav-header">Main Menu</p>
          <nav className="nav-list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isResultEmpty = item.id === 'result' && !hasResult;

              return (
                <button
                  key={item.id}
                  onClick={() => !isResultEmpty && setActiveTab(item.id)}
                  disabled={isResultEmpty}
                  className={`nav-button ${
                    isActive
                      ? 'active'
                      : isResultEmpty
                      ? 'disabled'
                      : ''
                  }`}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Status */}
      <div className="sidebar-footer">
        <div className="status-card">
          <div className="status-info">
            <div className="status-avatar">
              <div className="status-avatar-dot" />
            </div>
            <div className="status-text">
              <p className="status-title">Model Online</p>
              <p className="status-subtitle">Random Forest</p>
            </div>
          </div>
          <div className="status-indicator" />
        </div>
        <p className="footer-disclaimer">
          Your prediction data is processed securely.
        </p>
      </div>
    </aside>
  );
}

// import React from 'react';
// import { LayoutDashboard, FileBarChart, Calculator } from 'lucide-react';
// import './Sidebar.css';

// const NAV_ITEMS = [
//   { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
//   { id: 'patients', label: 'Patient Directory', icon: Users },
//   { id: 'predictor', label: 'Risk Prediction', icon: Calculator },
//   { id: 'result', label: 'Results', icon: FileBarChart },
// ];

// export default function Sidebar({ activeTab, setActiveTab, hasResult }) {
//   return (
//     <aside className="sidebar">
//       {/* Brand */}
//       <div className="sidebar-brand">
//         <div className="brand-logo-container">
//           <div className="brand-logo-icon">
//             <span className="brand-logo-bars">|||</span>
//           </div>
//         </div>
//         <div className="brand-text">
//           <h1 className="brand-title">CardioML</h1>
//           <p className="brand-subtitle">AI Risk Analysis</p>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="sidebar-content">
//         <div className="nav-group">
//           <p className="nav-header">Main Menu</p>
//           <nav className="nav-list">
//             {NAV_ITEMS.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeTab === item.id;
//               const isResultEmpty = item.id === 'result' && !hasResult;

//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => !isResultEmpty && setActiveTab(item.id)}
//                   disabled={isResultEmpty}
//                   className={`nav-button ${
//                     isActive
//                       ? 'active'
//                       : isResultEmpty
//                       ? 'disabled'
//                       : ''
//                   }`}
//                 >
//                   <Icon className="nav-icon" />
//                   <span>{item.label}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       </div>

//       {/* Footer / Status */}
//       <div className="sidebar-footer">
//         <div className="status-card">
//           <div className="status-info">
//             <div className="status-avatar">
//               <div className="status-avatar-dot" />
//             </div>
//             <div className="status-text">
//               <p className="status-title">Model Online</p>
//               <p className="status-subtitle">Random Forest</p>
//             </div>
//           </div>
//           <div className="status-indicator" />
//         </div>
//         <p className="footer-disclaimer">
//           Your prediction data is processed securely.
//         </p>
//       </div>
//     </aside>
//   );
// }