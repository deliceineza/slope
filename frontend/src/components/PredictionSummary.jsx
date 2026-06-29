import React from 'react';

const PredictionSummary = ({ result }) => {
  if (!result?.prediction) {
    return null;
  }

  const { prediction, parcel_location, terrain, accessibility, planning } = result;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimated Price</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{Number(prediction.estimated_price).toLocaleString()} FRW/sqm</p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimated Parcel Value</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{Number(prediction.parcel_value).toLocaleString()} FRW</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Prediction Confidence</p>
          <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{prediction.confidence}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-1">
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Master Plan Zone</p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{planning?.master_plan_zone}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-1">
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Terrain Class</p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{terrain?.terrain_class}</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;
