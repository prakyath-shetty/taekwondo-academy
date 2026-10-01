import type { ScheduleEvent } from '../types';

// ── Daily Evaluation ──
export interface DailyEvaluation {
  id: string;
  date: string;            // YYYY-MM-DD
  sessionId: ScheduleEvent['id'];
  sessionName: string;
  score: number;           // 0–100
  feedback: string;
}

// ── Weekly Evaluation ──
export interface WeeklyEvaluation {
  id: string;
  weekLabel: string;       // e.g. "Week 4"
  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  score: number;           // 0–100
  feedback: string;
}

// ── Practice Match ──
export type MatchResult = 'won' | 'lost' | 'draw';

export interface PracticeMatch {
  id: string;
  date: string;            // YYYY-MM-DD
  name: string;
  result: MatchResult;
  scoreFor: number;
  scoreAgainst: number;
  feedback: string;
}

// ── Centralized mock data ──
const Y = 2026;
const M = 9; // October (0-indexed)

const fmt = (day: number): string =>
  `${Y}-${String(M + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const fmtSep = (day: number): string =>
  `${Y}-${String(8).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const dailyEvaluations: DailyEvaluation[] = [
  {
    id: 'de1',
    date: fmt(1),
    sessionId: '1',
    sessionName: 'Advanced Taekwondo Training',
    score: 84,
    feedback: 'Good improvement in technique. Work on your front kick height.',
  },
  {
    id: 'de2',
    date: fmt(30),
    sessionId: '2',
    sessionName: 'Evening Training',
    score: 81,
    feedback: 'Improve speed and balance during sparring drills.',
  },
  {
    id: 'de3',
    date: fmt(29),
    sessionId: '3',
    sessionName: 'Poomsae Refinement',
    score: 79,
    feedback: 'Stances are solid. Focus on smooth transitions between movements.',
  },
  {
    id: 'de4',
    date: fmt(28),
    sessionId: '4',
    sessionName: 'Sparring Practice',
    score: 82,
    feedback: 'Good defensive positioning. Try closing distance faster after blocking.',
  },
  {
    id: 'de5',
    date: fmt(27),
    sessionId: '5',
    sessionName: 'Conditioning & Endurance',
    score: 77,
    feedback: 'Cardio is improving. Maintain pace through the final round.',
  },
  {
    id: 'de6',
    date: fmt(23),
    sessionId: '6',
    sessionName: 'Advanced Taekwondo Training',
    score: 80,
    feedback: 'Strong roundhouse kick power. Refine turning mechanics.',
  },
  {
    id: 'de7',
    date: fmt(22),
    sessionId: '7',
    sessionName: 'Evening Training',
    score: 78,
    feedback: 'Good attitude today. Keep pushing through fatigue drills.',
  },
  {
    id: 'de8',
    date: fmt(21),
    sessionId: '8',
    sessionName: 'Fundamentals Class',
    score: 85,
    feedback: 'Excellent basic forms. Ready to advance to intermediate techniques.',
  },
];

export const weeklyEvaluations: WeeklyEvaluation[] = [
  {
    id: 'we4',
    weekLabel: 'Week 4',
    startDate: fmt(23),
    endDate: fmt(1),
    score: 85,
    feedback:
      'Good improvement this week. Continue working on speed and balance. Your poomsae form has gotten much cleaner.',
  },
  {
    id: 'we3',
    weekLabel: 'Week 3',
    startDate: fmtSep(16),
    endDate: fmtSep(22),
    score: 81,
    feedback:
      'Steady progress. Sparring defense has improved noticeably. Focus on maintaining guard position.',
  },
  {
    id: 'we2',
    weekLabel: 'Week 2',
    startDate: fmtSep(9),
    endDate: fmtSep(15),
    score: 78,
    feedback:
      'Good effort this week. Conditioning results are showing. Work on flexibility drills daily.',
  },
  {
    id: 'we1',
    weekLabel: 'Week 1',
    startDate: fmtSep(2),
    endDate: fmtSep(8),
    score: 72,
    feedback:
      'Solid first week back. Basic techniques are reliable. Build consistency through repetition.',
  },
];

export const practiceMatches: PracticeMatch[] = [
  {
    id: 'pm1',
    date: fmt(28),
    name: 'Sparring Practice — Blue Belt Group',
    result: 'won',
    scoreFor: 8,
    scoreAgainst: 5,
    feedback: 'Good attacking movement. Improve defensive reaction time on counters.',
  },
  {
    id: 'pm2',
    date: fmt(20),
    name: 'Sparring Practice — Open Level',
    result: 'lost',
    scoreFor: 4,
    scoreAgainst: 6,
    feedback: 'Good technique. Improve distance management and maintain guard.',
  },
  {
    id: 'pm3',
    date: fmt(13),
    name: 'Sparring Practice — Blue Belt Group',
    result: 'won',
    scoreFor: 7,
    scoreAgainst: 3,
    feedback: 'Excellent footwork today. Keep using angles to create openings.',
  },
  {
    id: 'pm4',
    date: fmt(6),
    name: 'Sparring Practice — Weekly Drill',
    result: 'draw',
    scoreFor: 5,
    scoreAgainst: 5,
    feedback: 'Evenly matched. Work on finishing combinations before opponent recovers.',
  },
];

// ── Computed helpers ──

export function getOverallPerformance(): number {
  if (weeklyEvaluations.length === 0) return 0;
  return Math.round(
    weeklyEvaluations.reduce((sum, w) => sum + w.score, 0) / weeklyEvaluations.length,
  );
}

export function getLatestWeeklyEvaluation(): WeeklyEvaluation | undefined {
  return weeklyEvaluations[0];
}

export function getTrendData(): { week: string; score: number }[] {
  return weeklyEvaluations.map((w) => ({ week: w.weekLabel, score: w.score }));
}

export function getTrendDirection(): 'up' | 'stable' | 'down' {
  if (weeklyEvaluations.length < 2) return 'stable';
  const latest = weeklyEvaluations[0].score;
  const previous = weeklyEvaluations[1].score;
  if (latest > previous) return 'up';
  if (latest < previous) return 'down';
  return 'stable';
}

export function getMatchRecord(): { won: number; lost: number; draw: number } {
  return practiceMatches.reduce(
    (acc, m) => {
      acc[m.result]++;
      return acc;
    },
    { won: 0, lost: 0, draw: 0 },
  );
}

export function getAvgDailyScore(): number {
  if (dailyEvaluations.length === 0) return 0;
  return Math.round(
    dailyEvaluations.reduce((sum, d) => sum + d.score, 0) / dailyEvaluations.length,
  );
}

export default {
  dailyEvaluations,
  weeklyEvaluations,
  practiceMatches,
  getOverallPerformance,
  getLatestWeeklyEvaluation,
  getTrendData,
  getTrendDirection,
  getMatchRecord,
  getAvgDailyScore,
};
