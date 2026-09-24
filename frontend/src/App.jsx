import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Predictor from './components/Predictor';
import PatientDirectory from './components/PatientDirectory';
import ResultView from './components/ResultView';
import EmptyState from './components/EmptyState';
import ModelEvaluation from './components/ModelEvaluation';
import { DEFAULT_FORM } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activePreset, setActivePreset] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [result, setResult] = useState(null);

  const goTo = useCallback((tab) => {
    setActiveTab(tab);
    // document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCalculate = useCallback((res) => {
    setResult(res);
    setActiveTab('result');
  }, []);

  const handleSetPreset = useCallback((profile) => {
    setFormData(profile.data);
    setActivePreset(profile.id);
    setActiveTab('predictor');
  }, []);

  const handleResetInputs = useCallback(() => {
    setActiveTab('predictor');
  }, []);

  return (
    <div className="h-screen w-full flex bg-[#F8F9FB] text-slate-900 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={goTo} hasResult={!!result} />

      <main id="main-content" className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
        <div className="max-w-[1200px] mx-auto px-8 py-8 animate-fade-up">
          {activeTab === 'overview' && (
            <Dashboard setActiveTab={goTo} setPresetProfile={handleSetPreset} />
          )}

          {/* {activeTab === 'patients' && <PatientDirectory />} */}

          {activeTab === 'patients' && <PatientDirectory />}

          {activeTab === 'predictor' && (
            <Predictor
              formData={formData}
              setFormData={setFormData}
              onCalculate={handleCalculate}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
            />
          )}

          {activeTab === 'result' &&
            (result ? (
              <ResultView
                result={result}
                formData={formData}
                onReset={handleResetInputs}
                setActiveTab={goTo}
              />
            ) : (
              <EmptyState onStart={() => goTo('predictor')} />
            ))}

          {activeTab === 'model-eval' && <ModelEvaluation />}
        </div>
      </main>
    </div>
  );
}
