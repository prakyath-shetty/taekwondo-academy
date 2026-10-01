import React, { useEffect, useMemo, useState } from 'react';
import { Medal, Star, TrendingUp, Award } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import {
  achievements,
  getAchievementsByType,
  getTotalPoints,
  getRarityCount,
} from '../../mock/achievements';
import type { Achievement, AchievementType } from '../../mock/achievements';
import './Achievements.css';

const RARITY_CONFIG: Record<Achievement['rarity'], { bg: string; text: string; border: string }> = {
  common:   { bg: 'var(--tkd-bg)',           text: 'var(--tkd-fg-muted)',  border: 'var(--tkd-border)' },
  uncommon: { bg: 'var(--tkd-green-soft)',   text: 'var(--tkd-green)',     border: 'var(--tkd-green)' },
  rare:     { bg: 'var(--tkd-blue-soft)',    text: 'var(--tkd-blue)',      border: 'var(--tkd-blue)' },
  epic:     { bg: 'var(--tkd-purple-soft)',  text: 'var(--tkd-purple)',    border: 'var(--tkd-purple)' },
};

const TYPE_LABELS: Record<AchievementType, string> = {
  belt: 'Belt',
  tournament: 'Tournament',
  attendance: 'Attendance',
  performance: 'Performance',
  special: 'Special',
};

const ACHIEVEMENT_TYPES: AchievementType[] = ['belt', 'tournament', 'attendance', 'performance', 'special'];

const Achievements: React.FC = () => {
  const { setPage } = useNavigation();
  const [filter, setFilter] = useState<AchievementType | 'all'>('all');

  useEffect(() => { setPage('achievements'); }, [setPage]);

  const totalPoints = useMemo(() => getTotalPoints(), []);
  const rarityBreakdown = useMemo(() => ({
    common: getRarityCount('common'),
    uncommon: getRarityCount('uncommon'),
    rare: getRarityCount('rare'),
    epic: getRarityCount('epic'),
  }), []);

  const filtered = useMemo(() => {
    if (filter === 'all') return achievements;
    return getAchievementsByType(filter);
  }, [filter]);

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => b.earnedDate.localeCompare(a.earnedDate)),
    [filtered],
  );

  return (
    <AppShell>
      <div className="tkd-ach-page">
        <div className="tkd-ach-content">

          <div className="tkd-ach-header">
            <h1>Achievements</h1>
            <p>Track your milestones, badges, and progress.</p>
          </div>

          {/* KPI row */}
          <div className="tkd-ach-kpis">
            <div className="tkd-ach-kpi">
              <span className="tkd-ach-kpi-icon"><Award size={18} /></span>
              <span className="tkd-ach-kpi-val">{achievements.length}</span>
              <span className="tkd-ach-kpi-label">Total Badges</span>
            </div>
            <div className="tkd-ach-kpi">
              <span className="tkd-ach-kpi-icon"><TrendingUp size={18} /></span>
              <span className="tkd-ach-kpi-val">{totalPoints}</span>
              <span className="tkd-ach-kpi-label">Total Points</span>
            </div>
            <div className="tkd-ach-kpi">
              <span className="tkd-ach-kpi-icon"><Medal size={18} /></span>
              <span className="tkd-ach-kpi-val">{rarityBreakdown.epic + rarityBreakdown.rare}</span>
              <span className="tkd-ach-kpi-label">Rare & Epic</span>
            </div>
            <div className="tkd-ach-kpi">
              <span className="tkd-ach-kpi-icon"><Star size={18} /></span>
              <span className="tkd-ach-kpi-val">{rarityBreakdown.epic}</span>
              <span className="tkd-ach-kpi-label">Epic</span>
            </div>
          </div>

          {/* Filter chips */}
          <div className="tkd-ach-filters">
            <button
              className={`tkd-ach-filter${filter === 'all' ? ' tkd-ach-filter--active' : ''}`}
              onClick={() => setFilter('all')}
              type="button"
            >
              All <span className="tkd-ach-filter-count">{achievements.length}</span>
            </button>
            {ACHIEVEMENT_TYPES.map((type) => (
              <button
                key={type}
                className={`tkd-ach-filter${filter === type ? ' tkd-ach-filter--active' : ''}`}
                onClick={() => setFilter(type)}
                type="button"
              >
                {TYPE_LABELS[type]}
                <span className="tkd-ach-filter-count">
                  {getAchievementsByType(type).length}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="tkd-ach-grid">
            {sorted.map((a) => {
              const rc = RARITY_CONFIG[a.rarity];
              return (
                <div
                  key={a.id}
                  className="tkd-ach-card"
                  style={{ borderColor: rc.border, background: rc.bg }}
                >
                  <div className="tkd-ach-card-top">
                    <span className="tkd-ach-card-icon">{a.icon}</span>
                    <span
                      className="tkd-ach-card-rarity"
                      style={{ color: rc.text, background: `${rc.text}18` }}
                    >
                      {a.rarity}
                    </span>
                  </div>
                  <h3 className="tkd-ach-card-title">{a.title}</h3>
                  <p className="tkd-ach-card-desc">{a.description}</p>
                  <div className="tkd-ach-card-footer">
                    <span className="tkd-ach-card-points">+{a.points} pts</span>
                    <span className="tkd-ach-card-date">
                      {new Date(`${a.earnedDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {sorted.length === 0 && (
            <div className="tkd-ach-empty">No achievements in this category yet.</div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Achievements;
