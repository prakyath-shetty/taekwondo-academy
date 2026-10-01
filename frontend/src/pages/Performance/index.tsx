import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUp,
  ArrowDown,
  Minus,
  CalendarCheck,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import {
  dailyEvaluations,
  weeklyEvaluations,
  practiceMatches,
  getOverallPerformance,
  getLatestWeeklyEvaluation,
  getTrendData,
  getTrendDirection,
  getMatchRecord,
  getAvgDailyScore,
} from '../../mock/performance';
import type { WeeklyEvaluation } from '../../mock/performance';
import './Performance.css';

type ViewTab = 'overview' | 'daily' | 'weekly' | 'matches';

const TABS: { key: ViewTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'daily', label: 'Daily Evaluations' },
  { key: 'weekly', label: 'Weekly Evaluations' },
  { key: 'matches', label: 'Practice Matches' },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const formatDisplayDate = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const formatFullDate = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const scoreClass = (score: number): string => {
  if (score >= 80) return 'tkd-perf-row-score-num--high';
  if (score >= 60) return 'tkd-perf-row-score-num--mid';
  return 'tkd-perf-row-score-num--low';
};

const weekScoreClass = (score: number): string => {
  if (score >= 80) return 'tkd-perf-week-score-num--high';
  if (score >= 60) return 'tkd-perf-week-score-num--mid';
  return 'tkd-perf-week-score-num--low';
};

// ── SVG Bar Chart ──
interface ChartProps {
  data: { week: string; score: number }[];
}

const TrendChart: React.FC<ChartProps> = ({ data }) => {
  if (data.length === 0) return null;
  const padding = { top: 16, right: 12, bottom: 28, left: 36 };
  const width = 100;
  const height = 100;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxScore = 100;
  const minScore = Math.max(0, Math.min(...data.map((d) => d.score)) - 10);
  const range = maxScore - minScore || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padding.top + chartH - ((d.score - minScore) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding.left} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;

  // Y-axis grid lines
  const gridLines = [0, 25, 50, 75, 100].map((v) => {
    const y = padding.top + chartH - ((v - minScore) / range) * chartH;
    return { y, value: v };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="tkd-perf-svg" preserveAspectRatio="none">
      {/* Grid */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={g.y}
            x2={width - padding.right}
            y2={g.y}
            stroke="var(--tkd-border)"
            strokeWidth="0.5"
            strokeDasharray={i === 0 ? '0' : '2,2'}
          />
          <text
            x={padding.left - 3}
            y={g.y}
            textAnchor="end"
            dominantBaseline="middle"
            fill="var(--tkd-fg-muted)"
            fontSize="7"
            fontWeight="500"
          >
            {g.value}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="var(--tkd-red-soft)" opacity="0.4" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="var(--tkd-red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots + labels */}
      {points.map((p, i) => (
        <g key={i} className="tkd-perf-bar-group">
          <circle cx={p.x} cy={p.y} r="2.5" fill="var(--tkd-red)" stroke="var(--tkd-surface)" strokeWidth="0.8" />
          <text
            className="tkd-perf-bar-label"
            x={p.x}
            y={p.y - 5}
            textAnchor="middle"
            fill="var(--tkd-fg)"
            fontSize="6.5"
            fontWeight="700"
          >
            {p.score}%
          </text>
          <text
            className="tkd-perf-bar-xlabel"
            x={p.x}
            y={height - 4}
            textAnchor="middle"
            fill="var(--tkd-fg-muted)"
            fontSize="6.5"
            fontWeight="600"
          >
            {p.week.replace('Week ', 'W')}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ── Overview Tab ──
const OverviewView: React.FC<{ onNavigate: (tab: ViewTab) => void }> = ({ onNavigate }) => {
  const overallScore = useMemo(() => getOverallPerformance(), []);
  const latestWeekly = useMemo(() => getLatestWeeklyEvaluation(), []);
  const trendData = useMemo(() => getTrendData(), []);
  const trendDir = useMemo(() => getTrendDirection(), []);
  const matchRecord = useMemo(() => getMatchRecord(), []);
  const avgDaily = useMemo(() => getAvgDailyScore(), []);

  const trendIcon = trendDir === 'up' ? <ArrowUp size={12} /> : trendDir === 'down' ? <ArrowDown size={12} /> : <Minus size={12} />;
  const trendLabel = trendDir === 'up' ? 'Improving' : trendDir === 'down' ? 'Declining' : 'Stable';
  const trendClass = `tkd-perf-trend-badge tkd-perf-trend-badge--${trendDir}`;

  return (
    <>
      {/* Summary cards */}
      <div className="tkd-perf-summary">
        <div className="tkd-perf-stat">
          <span className="tkd-perf-stat-label">Overall Performance</span>
          <span className={`tkd-perf-stat-value ${overallScore >= 80 ? 'tkd-perf-stat-value--green' : overallScore >= 60 ? 'tkd-perf-stat-value--blue' : 'tkd-perf-stat-value--orange'}`}>
            {overallScore}%
          </span>
        </div>
        <div className="tkd-perf-stat">
          <span className="tkd-perf-stat-label">Latest Weekly Score</span>
          <span className="tkd-perf-stat-value" style={{ color: 'var(--tkd-blue)' }}>
            {latestWeekly?.score ?? '—'}%
          </span>
        </div>
        <div className="tkd-perf-stat">
          <span className="tkd-perf-stat-label">Practice Matches</span>
          <span className="tkd-perf-stat-value">
            {matchRecord.won}<span style={{ color: 'var(--tkd-fg-muted)', fontWeight: 500 }}>–{matchRecord.lost}</span>
          </span>
        </div>
        <div className="tkd-perf-stat">
          <span className="tkd-perf-stat-label">Avg Daily Score</span>
          <span className={`tkd-perf-stat-value ${avgDaily >= 80 ? 'tkd-perf-stat-value--green' : avgDaily >= 60 ? 'tkd-perf-stat-value--blue' : 'tkd-perf-stat-value--orange'}`}>
            {avgDaily}%
          </span>
        </div>
      </div>

      {/* Trend chart */}
      <div className="tkd-perf-chart-section">
        <div className="tkd-perf-chart-head">
          <h2>
            <TrendingUp size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Performance Trend
          </h2>
          <span className={trendClass}>{trendIcon} {trendLabel}</span>
        </div>
        <div className="tkd-perf-chart-body">
          <TrendChart data={trendData} />
        </div>
      </div>

      {/* Latest evaluation */}
      <div className="tkd-perf-latest">
        <div className="tkd-perf-latest-header">
          <div className="tkd-perf-latest-title">
            <CalendarCheck size={15} color="var(--tkd-red)" />
            <span>Latest Evaluation</span>
          </div>
          <button
            className="tkd-view-all"
            onClick={() => onNavigate('weekly')}
            type="button"
          >
            View All
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        {latestWeekly ? (
          <>
            <div className="tkd-perf-latest-score">
              <strong>{latestWeekly.score}%</strong>
              <small>/ 100</small>
            </div>
            <div className="tkd-perf-latest-meta">{latestWeekly.weekLabel} · {formatDisplayDate(latestWeekly.startDate)} – {formatDisplayDate(latestWeekly.endDate)}</div>
            <p className="tkd-perf-latest-feedback">{latestWeekly.feedback}</p>
          </>
        ) : (
          <div className="tkd-perf-empty">No evaluations yet</div>
        )}
      </div>
    </>
  );
};

// ── Daily Evaluations Tab ──
const DailyView: React.FC = () => {
  const sorted = useMemo(() => [...dailyEvaluations].sort((a, b) => b.date.localeCompare(a.date)), []);
  return (
    <div className="tkd-perf-list">
      {sorted.map((ev) => (
        <div key={ev.id} className="tkd-perf-row">
          <div className="tkd-perf-row-date">
            <strong>{new Date(`${ev.date}T00:00:00`).getDate()}</strong>
            <span>{MONTHS[new Date(`${ev.date}T00:00:00`).getMonth()]}</span>
          </div>
          <div className="tkd-perf-row-main">
            <strong>{ev.sessionName}</strong>
            <span className="tkd-perf-feedback-line">{ev.feedback}</span>
          </div>
          <div className="tkd-perf-row-score">
            <span className={`tkd-perf-row-score-num ${scoreClass(ev.score)}`}>{ev.score}%</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="tkd-perf-row-arrow"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      ))}
    </div>
  );
};

// ── Weekly Evaluations Tab ──
const WeeklyView: React.FC<{ onSelect: (w: WeeklyEvaluation) => void }> = ({ onSelect }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => weeklyEvaluations.find((w) => w.id === selectedId), [selectedId]);

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 minmax(0, 48%)', minWidth: 0 }}>
        <div className="tkd-perf-section-label">Weekly Evaluations</div>
        <div className="tkd-perf-list">
          {weeklyEvaluations.map((w) => (
            <div
              key={w.id}
              className={`tkd-perf-row${selectedId === w.id ? ' tkd-perf-row--selected' : ''}`}
              onClick={() => { setSelectedId(w.id); onSelect(w); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { setSelectedId(w.id); onSelect(w); }
              }}
            >
              <div className="tkd-perf-row-date">
                <strong style={{ fontSize: '0.6875rem' }}>{w.weekLabel.replace('Week ', 'W')}</strong>
                <span>{formatDisplayDate(w.startDate).split(' ')[1]}</span>
              </div>
              <div className="tkd-perf-row-main">
                <strong>{w.weekLabel}</strong>
                <span className="tkd-perf-row-meta">{formatDisplayDate(w.startDate)} – {formatDisplayDate(w.endDate)}</span>
              </div>
              <div className="tkd-perf-week-score">
                <span className={`tkd-perf-week-score-num ${weekScoreClass(w.score)}`}>{w.score}</span>
                <span className="tkd-perf-week-score-pct">%</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="tkd-perf-row-arrow"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="tkd-perf-latest" style={{ flex: '0 0 minmax(0, 52%)', minWidth: 0 }}>
          <div className="tkd-perf-latest-header">
            <div className="tkd-perf-latest-title">
              <CalendarCheck size={15} color="var(--tkd-red)" />
              <span>{selected.weekLabel}</span>
            </div>
          </div>
          <div className="tkd-perf-latest-meta">{formatFullDate(selected.startDate)} – {formatFullDate(selected.endDate)}</div>
          <div className="tkd-perf-latest-score">
            <strong>{selected.score}%</strong>
            <small>/ 100</small>
          </div>
          <p className="tkd-perf-latest-feedback">{selected.feedback}</p>
        </div>
      )}
    </div>
  );
};

// ── Practice Matches Tab ──
const MatchesView: React.FC = () => {
  const sorted = useMemo(() => [...practiceMatches].sort((a, b) => b.date.localeCompare(a.date)), []);
  return (
    <div className="tkd-perf-list">
      {sorted.map((m) => (
        <div key={m.id} className="tkd-perf-row">
          <div className="tkd-perf-row-date">
            <strong>{new Date(`${m.date}T00:00:00`).getDate()}</strong>
            <span>{MONTHS[new Date(`${m.date}T00:00:00`).getMonth()]}</span>
          </div>
          <div className="tkd-perf-row-main">
            <strong>{m.name}</strong>
            <span className="tkd-perf-feedback-line">{m.feedback}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
            <span className={`tkd-perf-result tkd-perf-result--${m.result}`}>{m.result}</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--tkd-fg)' }}>
              {m.scoreFor} – {m.scoreAgainst}
            </span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="tkd-perf-row-arrow"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      ))}
    </div>
  );
};

// ── Page ──
const Performance: React.FC = () => {
  const { setPage } = useNavigation();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewTab>('overview');

  useEffect(() => { setPage('performance'); }, [setPage]);

  const handleTabClick = (tab: ViewTab) => {
    setView(tab);
    navigate('/app/performance');
  };

  return (
    <AppShell>
      <div className="tkd-perf-page">
        <div className="tkd-perf-content">

          <div className="tkd-perf-header">
            <h1>Performance</h1>
            <p>Track your progress and coaching feedback</p>
          </div>

          <div className="tkd-perf-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tkd-perf-tab${view === tab.key ? ' tkd-perf-tab--active' : ''}`}
                onClick={() => handleTabClick(tab.key)}
                role="tab"
                aria-selected={view === tab.key}
                type="button"
              >
                {tab.key === 'overview' && <TrendingUp size={14} />}
                {tab.key === 'daily' && <Zap size={14} />}
                {tab.key === 'weekly' && <CalendarCheck size={14} />}
                {tab.key === 'matches' && <Trophy size={14} />}
                {tab.label}
              </button>
            ))}
          </div>

          {view === 'overview' && <OverviewView onNavigate={handleTabClick} />}
          {view === 'daily' && <DailyView />}
          {view === 'weekly' && <WeeklyView onSelect={() => {}} />}
          {view === 'matches' && <MatchesView />}

        </div>
      </div>
    </AppShell>
  );
};

export default Performance;
