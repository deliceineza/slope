import React from 'react';

const PredictionHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const formatValue = (value, suffix) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return 'Prediction unavailable';
    }
    return `${number.toLocaleString()} ${suffix}`;
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">Recent valuations</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Latest 5 results</p>
      </div>
      <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
        {history.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(entry.timestamp).toLocaleString()}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{entry.status}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950">
                <p className="text-slate-500 dark:text-slate-400">Price</p>
                <p className="text-slate-900 dark:text-white">{formatValue(entry.price, 'FRW/sqm')}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950">
                <p className="text-slate-500 dark:text-slate-400">Parcel value</p>
                <p className="text-slate-900 dark:text-white">{formatValue(entry.parcelValue, 'FRW')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;
