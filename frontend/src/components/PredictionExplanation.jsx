import React from 'react';

const PredictionExplanation = ({ explanation }) => {
  if (!explanation) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">Why is this land valued this way?</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">A concise summary of the factors that helped and limited value.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] bg-white p-5 shadow-sm dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Positive factors</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {explanation.positive?.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 text-orange-500">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.25rem] bg-slate-900 p-5 text-white shadow-sm dark:bg-slate-800">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-200">Negative factors</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {explanation.negative?.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 text-orange-300">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PredictionExplanation;
