import React from 'react';
import { Presentation, HeartPulse, ArrowRight } from 'lucide-react';

export default function EmptyState({ onStart }) {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-16 animate-fade-up">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-sky-100 to-purple-100 border border-sky-200 text-sky-600 flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(78,111,191,0.35)]">
        <Presentation className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
          No results yet
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Run a cardiovascular risk assessment first, and your personalized report will appear here.
        </p>
      </div>
      <button onClick={onStart} className="btn btn-primary">
        <HeartPulse className="w-4 h-4" />
        Start Assessment
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}