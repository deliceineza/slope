import React from 'react';

const PredictionProgress = ({ steps, activeIndex, completed }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span>Workflow progress</span>
        <span>{completed ? 'Completed' : `Step ${Math.min(activeIndex + 1, steps.length)} of ${steps.length}`}</span>
      </div>
      <div className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex || completed;
          return (
            <div key={step} className="flex items-start gap-3">
              <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isDone ? 'bg-orange-500 text-white' : isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {isDone ? '✓' : index + 1}
              </div>
              <div>
                <p className={`text-sm ${isDone ? 'text-slate-900 dark:text-white' : isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionProgress;
