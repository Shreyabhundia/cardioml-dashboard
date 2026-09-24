import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Activity className="w-4 h-4 animate-heartbeat" />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-slate-900 leading-none">
                Cardio<span className="gradient-text-cyan">ML</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Computer Engineering ML Project · Darshan University
              </div>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1 max-w-md">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Built for educational and research evaluation using the Sulianova Cardiovascular
              dataset (70,000 records). Predictions are probabilistic estimates — not a diagnosis.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}