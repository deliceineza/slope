import React from 'react';

const PredictionResult = ({ result }) => {
  if (!result) {
    return null;
  }

  const safeNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  const formattedPrice = (() => {
    const price = safeNumber(result.predicted_price ?? result.estimated_price);
    return price === null ? 'Prediction unavailable' : `${price.toLocaleString()} FRW/sqm`;
  })();

  const generatedAt = result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Unknown';

  return (
    <div className="space-y-4 rounded-[1.25rem] border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">Prediction Result</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">{result.status}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimated Price</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{formattedPrice}</p>
        </div>
        <div className="grid gap-3">
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Confidence</p>
            <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{result.confidence}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Generated</p>
            <p className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{generatedAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
