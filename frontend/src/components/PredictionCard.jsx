import React, { useEffect, useRef, useState } from 'react';
import SlopeSlider from './SlopeSlider';
import PredictionProgress from './PredictionProgress';
import PredictionSummary from './PredictionSummary';
import PredictionExplanation from './PredictionExplanation';
import PredictionHistory from './PredictionHistory';

const progressSteps = [
  'Reading coordinates...',
  'Identifying land location...',
  'Analyzing terrain...',
  'Measuring accessibility...',
  'Reading planning information...',
  'Preparing AI features...',
  'Running AI valuation...',
  'Generating explanation...',
];

const PredictionCard = ({ token, onPredict }) => {
  const [longitude, setLongitude] = useState(30.0588);
  const [latitude, setLatitude] = useState(-1.9441);
  const [coordinateSystem, setCoordinateSystem] = useState('WGS84');
  const [slope, setSlope] = useState(12);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(-1);
  const [progress, setProgress] = useState([]);
  const progressTimerRef = useRef(null);

  const DEFAULT_AREA = 500;
  const DEFAULT_YEAR = new Date().getFullYear();
  const DEFAULT_WEIGHT = 1.0;
  const DEFAULT_POPULATION = 1800;
  const DEFAULT_HOUSEHOLDS = 420;

  const stopProgress = () => {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const startProgress = () => {
    stopProgress();
    setProgress([progressSteps[0]]);
    setActiveStep(0);

    const updateStep = (index) => {
      if (index >= progressSteps.length) {
        return;
      }

      setProgress((prev) => {
        const next = [...prev];
        next[index] = progressSteps[index];
        return next;
      });
      setActiveStep(index);

      progressTimerRef.current = setTimeout(() => updateStep(index + 1), 350);
    };

    progressTimerRef.current = setTimeout(() => updateStep(1), 350);
  };

  useEffect(() => {
    return () => {
      stopProgress();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setProgress([]);
    setActiveStep(-1);

    if (!longitude || !latitude) {
      setError('Please enter valid longitude and latitude.');
      return;
    }

    setLoading(true);
    startProgress();

    try {
      const payload = {
        longitude: Number(longitude),
        latitude: Number(latitude),
        slope: Number(slope),
        area: DEFAULT_AREA,
        year: DEFAULT_YEAR,
        weight: DEFAULT_WEIGHT,
        population: DEFAULT_POPULATION,
        households: DEFAULT_HOUSEHOLDS,
      };

      const response = await onPredict(payload, token);
      setResult(response);
      setProgress(response.steps ?? progressSteps);
      setActiveStep(progressSteps.length);

      const prediction = response.prediction || {};
      const historyEntry = {
        id: prediction.timestamp || new Date().toISOString(),
        price: prediction.estimated_price,
        parcelValue: prediction.parcel_value,
        status: prediction.status,
        timestamp: prediction.timestamp || new Date().toISOString(),
      };
      setHistory((prev) => [historyEntry, ...prev].slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed.');
    } finally {
      stopProgress();
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/30 transition dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">Land Price Prediction</p>
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Predict an estimated land price</h3>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Use location, slope, and local metrics to estimate land value with a step-by-step AI valuation workflow.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span>Longitude</span>
            <input
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              type="number"
              step="0.0001"
              className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-base outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span>Latitude</span>
            <input
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              type="number"
              step="0.0001"
              className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-base outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span>Coordinate system</span>
            <select
              value={coordinateSystem}
              onChange={(event) => setCoordinateSystem(event.target.value)}
              className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-base outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="WGS84">WGS84</option>
              <option value="UTM">UTM</option>
              <option value="Local">Local</option>
            </select>
          </label>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Slope</span>
            <SlopeSlider value={slope} onChange={setSlope} />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex min-h-[56px] items-center justify-center rounded-[1rem] bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74] px-8 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Running AI valuation...' : 'Run AI Valuation'}
          </button>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </form>

      <PredictionProgress steps={progress} activeIndex={activeStep} completed={!loading && progress.length > 0} />
      <PredictionSummary result={result} />
      <PredictionExplanation explanation={result?.explanation} />
      <PredictionHistory history={history} />
    </div>
  );
};

export default PredictionCard;
