export type AchievementType = 'belt' | 'tournament' | 'attendance' | 'performance' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  earnedDate: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  points: number;
  category: string;
}

export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Blue Belt',
    description: 'Promoted to Blue Belt after demonstrating consistent progress and dedication to training.',
    type: 'belt',
    earnedDate: '2026-06-15',
    icon: '🥋',
    rarity: 'rare',
    points: 500,
    category: 'Belt Progression',
  },
  {
    id: 'ach-2',
    title: 'District Champion',
    description: 'Won 1st place at the District Taekwondo Open in the Green Belt Kyorugi category.',
    type: 'tournament',
    earnedDate: '2026-04-20',
    icon: '🏆',
    rarity: 'epic',
    points: 1000,
    category: 'Competition',
  },
  {
    id: 'ach-3',
    title: 'Perfect Attendance — 3 Months',
    description: 'Maintained 100% attendance (no absences, no late arrivals) for an entire quarter.',
    type: 'attendance',
    earnedDate: '2026-03-31',
    icon: '📅',
    rarity: 'uncommon',
    points: 200,
    category: 'Discipline',
  },
  {
    id: 'ach-4',
    title: '100 Session Milestone',
    description: 'Completed 100 training sessions at the academy, marking a significant commitment to the art.',
    type: 'performance',
    earnedDate: '2026-02-14',
    icon: '💯',
    rarity: 'rare',
    points: 350,
    category: 'Training',
  },
  {
    id: 'ach-5',
    title: 'Poomsae Excellence',
    description: 'Received highest judge score for Taegeuk 5 Poomsae at the academy intra-club demonstration.',
    type: 'special',
    earnedDate: '2026-05-01',
    icon: '⭐',
    rarity: 'uncommon',
    points: 250,
    category: 'Technique',
  },
  {
    id: 'ach-6',
    title: 'Team Player Award',
    description: 'Recognized by coaches for consistently supporting fellow students and helping newer members.',
    type: 'special',
    earnedDate: '2026-07-10',
    icon: '🤝',
    rarity: 'common',
    points: 100,
    category: 'Character',
  },
  {
    id: 'ach-7',
    title: 'Rising Star',
    description: 'Awarded to the most improved student of the semester based on coach evaluations and test scores.',
    type: 'performance',
    earnedDate: '2026-01-20',
    icon: '🌟',
    rarity: 'rare',
    points: 400,
    category: 'Growth',
  },
  {
    id: 'ach-8',
    title: 'Consistency King',
    description: 'Attended every scheduled session for 6 consecutive months without a single absence.',
    type: 'attendance',
    earnedDate: '2026-08-01',
    icon: '🔥',
    rarity: 'epic',
    points: 600,
    category: 'Discipline',
  },
  {
    id: 'ach-9',
    title: 'Sparring Master',
    description: 'Achieved a winning record in all inter-club sparring matches during the Autumn League season.',
    type: 'tournament',
    earnedDate: '2025-11-15',
    icon: '⚔️',
    rarity: 'rare',
    points: 450,
    category: 'Competition',
  },
  {
    id: 'ach-10',
    title: 'White Belt Graduate',
    description: 'Successfully completed the White Belt introductory course with all technique tests passed.',
    type: 'belt',
    earnedDate: '2025-09-01',
    icon: '🎖️',
    rarity: 'common',
    points: 50,
    category: 'Belt Progression',
  },
  {
    id: 'ach-11',
    title: 'First Tournament',
    description: 'Participated in your first official taekwondo competition, showing courage and sportsmanship.',
    type: 'tournament',
    earnedDate: '2025-10-12',
    icon: '🎯',
    rarity: 'common',
    points: 75,
    category: 'Competition',
  },
  {
    id: 'ach-12',
    title: 'Dedicated Scholar',
    description: 'Maintained a 90% or higher average score across all weekly coach evaluations for a full semester.',
    type: 'performance',
    earnedDate: '2026-09-15',
    icon: '📊',
    rarity: 'uncommon',
    points: 300,
    category: 'Growth',
  },
];

export function getAchievementsByType(type: AchievementType): Achievement[] {
  return achievements.filter((a) => a.type === type);
}

export function getTotalPoints(): number {
  return achievements.reduce((sum, a) => sum + a.points, 0);
}

export function getRarityCount(rarity: Achievement['rarity']): number {
  return achievements.filter((a) => a.rarity === rarity).length;
}
