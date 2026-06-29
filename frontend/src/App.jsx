import { useState, useEffect, useRef } from 'react';
import { analyzeSlope } from './api';
import { predictLandPrice } from './services/predictionService';
import PredictionCard from './components/PredictionCard';

const statusStyles = {
  standard: 'bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74] text-white shadow-lg shadow-orange-500/20',
  highcost: 'bg-white/5 ring-1 ring-[#F97316] text-[#F97316] dark:bg-white/5 dark:text-[#FDBA74] dark:ring-[#FDBA74]',
  denied: 'bg-slate-900 text-white shadow-sm dark:bg-slate-800',
  default: 'bg-white/5 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
};

function getPermitStyle(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('standard')) return statusStyles.standard;
  if (normalized.includes('high-cost') || normalized.includes('high cost') || normalized.includes('highcost')) return statusStyles.highcost;
  if (normalized.includes('no permit') || normalized.includes('denied') || normalized.includes('not granted')) return statusStyles.denied;
  return statusStyles.default;
}

function App() {
  const [slope, setSlope] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const analyzeRef = useRef(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [isDark, theme]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    const numericSlope = Number(slope);
    if (Number.isNaN(numericSlope) || slope === '') {
      setError('Enter a valid slope.');
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeSlope(numericSlope);
      setResult(data);
    } catch (err) {
      setError('Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const displayValue = (value) => (value ?? 'N/A');
  const permitStatus = result?.permitStatus || result?.permit_status || 'Unknown';
  const landValue = result?.land_value ?? result?.landValueAssessment ?? result?.land_value_assessment ?? 'N/A';
  const slopeValue = result?.slope ?? slope;
  const statusClass = getPermitStyle(permitStatus);


  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#111827] text-white' : 'bg-white text-slate-900'}`}>
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-xl transition dark:border-slate-800 dark:bg-[#111827]/90 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-3xl ${isDark ? 'bg-orange-500/15' : 'bg-orange-50'}`}>
              <span className="text-lg">⛰️</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">Land Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isDark ? 'bg-slate-900 text-white shadow-sm shadow-black/30 hover:bg-slate-800' : 'bg-white text-slate-900 shadow-sm hover:bg-slate-50'}`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span>{theme === 'light' ? '☀️' : '🌙'}</span>
              <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-12 card py-12 transition highlight-card dark:bg-slate-900 dark:shadow-lg dark:shadow-black/30 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">Premium land insights</p>
              <h1 className="text-5xl font-semibold tracking-tight leading-tight text-[#1F2937] dark:text-white sm:text-6xl">Smart Land Assessment</h1>
              <p className="max-w-xl text-lg leading-8 text-[#6B7280] dark:text-slate-300">Evaluate land suitability and permit eligibility in seconds.</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => analyzeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-full sm:w-auto inline-flex min-h-[56px] items-center justify-center rounded-[1rem] bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74] px-8 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring focus-visible:ring-orange-300"
              >
                Analyze Now
              </button>
              <div className="rounded-[1rem] px-5 py-3 text-sm font-semibold text-[#1F2937] dark:text-slate-100">
                Fast land assessment
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden card transition dark:bg-slate-800 dark:shadow-lg dark:shadow-black/30">
            <div className="relative z-10 flex flex-col items-start gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-50 shadow-sm dark:bg-slate-700 dark:shadow-sm dark:shadow-black/20">
                <span className="text-3xl">🗺️</span>
              </div>
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Terrain Overview</p>
                <p className="max-w-md text-sm leading-6 text-[#6B7280] dark:text-slate-300">Sleek, map-driven tools for clear and precise land analysis.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-2xl card sm:p-10" ref={analyzeRef}>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-[#1F2937] dark:text-white">Slope Analysis</h2>
            <p className="text-sm text-[#6B7280] dark:text-slate-400">One clean input to evaluate permit readiness.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
            <input
              value={slope}
              onChange={(event) => setSlope(event.target.value)}
              type="number"
              min="0"
              placeholder="Enter slope in degrees"
              className={`w-full rounded-[0.75rem] border px-5 py-4 text-lg outline-none transition ${isDark ? 'border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-orange-500' : 'border-slate-200 bg-white text-slate-900 placeholder:text-[#6B7280] focus:border-orange-500'}`}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[56px] items-center justify-center rounded-[1rem] bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74] px-8 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-[1rem] bg-red-50 px-5 py-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="card card-lg">
                <p className="text-xs uppercase tracking-[0.3em] card-desc">Slope</p>
                <p className="mt-4 text-3xl card-value">{displayValue(slopeValue)}°</p>
              </div>
              <div className="card card-lg">
                <p className="text-xs uppercase tracking-[0.3em] card-desc">Permit Status</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold transition">
                  <span className={statusClass}>{permitStatus}</span>
                </div>
              </div>
              <div className="card card-lg">
                <p className="text-xs uppercase tracking-[0.3em] card-desc">Land Value</p>
                <p className="mt-4 text-3xl card-value">{displayValue(landValue)}</p>
              </div>
            </div>
          )}
        </section>

        <section className="mt-16">
          <PredictionCard onPredict={predictLandPrice} />
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="card card-accent card-highlight">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] card-title">Why Use Land Assessment?</p>
            <div className="mt-8 space-y-3">
              {['Fast Analysis', 'Permit Guidance', 'Land Value Insights'].map((item) => (
                <div key={item} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span className="text-orange-500 dark:text-orange-300">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="card card-accent">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] card-title">How It Works</p>
            <div className="mt-8 space-y-3">
              {[
                'Enter Slope',
                'Analyze',
                'View Results',
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <div className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-orange-500 dark:text-orange-300">{index + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 transition dark:text-slate-400">
        © 2026 Land Assessment
      </footer>
    </div>
  );
}

export default App;
