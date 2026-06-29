import React from 'react';

const PredictionSummary = ({ result }) => {
  if (!result?.prediction) {
    return null;
  }

  const { prediction, parcel_location, terrain, accessibility, planning } = result;
  const safeNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  const predictedPrice = safeNumber(prediction.estimated_price ?? prediction.predicted_price);
  const parcelValue = safeNumber(prediction.parcel_value);
  const formattedPrice = predictedPrice === null ? 'Prediction unavailable' : `${predictedPrice.toLocaleString()} FRW/sqm`;
  const formattedParcelValue = parcelValue === null ? 'Prediction unavailable' : `${parcelValue.toLocaleString()} FRW`;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimated Price</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{formattedPrice}</p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimated Parcel Value</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{formattedParcelValue}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Prediction Confidence</p>
          <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{prediction.confidence}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Elevation</p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
            {safeNumber(terrain?.elevation) === null ? 'Prediction unavailable' : `${terrain.elevation.toLocaleString()} m`}
          </p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Masterplan Use</p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{planning?.land_use || 'Prediction unavailable'}</p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Distance to Road</p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
            {safeNumber(accessibility?.distance_to_road) === null ? 'Prediction unavailable' : `${accessibility.distance_to_road.toLocaleString()} km`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;
