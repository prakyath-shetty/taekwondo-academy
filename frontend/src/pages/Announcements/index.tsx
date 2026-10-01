import React, { useEffect, useMemo, useState } from 'react';
import { Megaphone, Calendar } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import { announcements, getAnnouncementsByPriority, getRecentAnnouncements } from '../../mock/announcements';
import type { Announcement } from '../../mock/announcements';
import './Announcements.css';

const PRIORITY_CONFIG: Record<Announcement['priority'], { bg: string; text: string; dot: string }> = {
  high:   { bg: 'var(--tkd-red-soft)',    text: 'var(--tkd-red)',     dot: 'var(--tkd-red)' },
  medium: { bg: 'var(--tkd-orange-soft)', text: 'var(--tkd-orange)',  dot: 'var(--tkd-orange)' },
  low:    { bg: 'var(--tkd-bg)',          text: 'var(--tkd-fg-muted)', dot: 'var(--tkd-fg-subtle)' },
};

const Announcements: React.FC = () => {
  const { setPage } = useNavigation();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selected, setSelected] = useState<Announcement | null>(null);

  useEffect(() => { setPage('announcements'); }, [setPage]);

  const recent = useMemo(() => getRecentAnnouncements(3), []);
  const filtered = useMemo(() => {
    if (filter === 'all') return announcements;
    return getAnnouncementsByPriority(filter);
  }, [filter]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered],
  );

  return (
    <AppShell>
      <div className="tkd-ann-page">
        <div className="tkd-ann-content">

          <div className="tkd-ann-header">
            <h1>Announcements</h1>
            <p>Stay updated with academy news and important notices.</p>
          </div>

          {/* Highlighted recent */}
          <div className="tkd-ann-highlight">
            <div className="tkd-ann-highlight-head">
              <Megaphone size={16} color="var(--tkd-red)" />
              <span>Recent Highlights</span>
            </div>
            <div className="tkd-ann-highlight-list">
              {recent.map((a) => {
                const pc = PRIORITY_CONFIG[a.priority];
                return (
                  <button
                    key={a.id}
                    className="tkd-ann-highlight-item"
                    onClick={() => setSelected(a)}
                    type="button"
                  >
                    <span className="tkd-ann-highlight-dot" style={{ background: pc.dot }} />
                    <div>
                      <strong>{a.title}</strong>
                      <span className="tkd-ann-highlight-date">{a.author} · {new Date(`${a.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority filter */}
          <div className="tkd-ann-filters">
            <button className={`tkd-ann-filter${filter === 'all' ? ' tkd-ann-filter--active' : ''}`} onClick={() => setFilter('all')} type="button">
              All <span className="tkd-ann-filter-count">{announcements.length}</span>
            </button>
            {(['high', 'medium', 'low'] as const).map((p) => {
              const pc = PRIORITY_CONFIG[p];
              return (
                <button
                  key={p}
                  className={`tkd-ann-filter${filter === p ? ' tkd-ann-filter--active' : ''}`}
                  onClick={() => setFilter(p)}
                  type="button"
                  style={filter === p ? { borderColor: pc.dot, color: pc.text } : {}}
                >
                  <span className="tkd-ann-filter-priority-dot" style={{ background: pc.dot }} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                  <span className="tkd-ann-filter-count">{getAnnouncementsByPriority(p).length}</span>
                </button>
              );
            })}
          </div>

          {/* Full list or detail */}
          {!selected ? (
            <div className="tkd-ann-list">
              {sorted.map((a) => {
                const pc = PRIORITY_CONFIG[a.priority];
                return (
                  <button
                    key={a.id}
                    className="tkd-ann-item"
                    onClick={() => setSelected(a)}
                    type="button"
                  >
                    <span className="tkd-ann-item-bar" style={{ background: pc.dot }} />
                    <div className="tkd-ann-item-content">
                      <div className="tkd-ann-item-top">
                        <strong className="tkd-ann-item-title">{a.title}</strong>
                        <span className="tkd-ann-item-priority" style={{ color: pc.text, background: pc.bg }}>
                          {a.priority}
                        </span>
                      </div>
                      <p className="tkd-ann-item-body">{a.body}</p>
                      <div className="tkd-ann-item-footer">
                        <span className="tkd-ann-item-author">{a.author}</span>
                        <span className="tkd-ann-item-date">
                          <Calendar size={11} />
                          {new Date(`${a.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <div className="tkd-ann-tags">
                          {a.tags.map((tag) => (
                            <span key={tag} className="tkd-ann-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="tkd-ann-detail">
              <button className="tkd-ann-back" onClick={() => setSelected(null)} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to all
              </button>
              <div className="tkd-ann-detail-meta">
                <span className="tkd-ann-detail-priority" style={{ color: PRIORITY_CONFIG[selected.priority].text, background: PRIORITY_CONFIG[selected.priority].bg }}>
                  {selected.priority}
                </span>
                <span className="tkd-ann-detail-author">{selected.author}</span>
                <span className="tkd-ann-detail-date">
                  {new Date(`${selected.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="tkd-ann-detail-title">{selected.title}</h2>
              <p className="tkd-ann-detail-body">{selected.body}</p>
              <div className="tkd-ann-detail-tags">
                {selected.tags.map((tag) => (
                  <span key={tag} className="tkd-ann-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Announcements;
