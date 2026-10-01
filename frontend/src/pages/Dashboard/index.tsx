import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, BarChart3, Medal, Flame } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import HeroBanner from '../../components/dashboard/HeroBanner';
import CalendarWidget from '../../components/dashboard/CalendarWidget';
import VideoRow from '../../components/dashboard/VideoRow';
import AnnouncementsCard from '../../components/dashboard/AnnouncementsCard';
import LeaderboardCard from '../../components/dashboard/LeaderboardCard';
import EventsCard from '../../components/dashboard/EventsCard';
import mockData from '../../mock/dashboard';
import { getAttendanceRecords } from '../../mock/attendance';
import { getRecentAnnouncements } from '../../mock/announcements';
import events from '../../mock/schedule';
import { getTrainingVideos } from '../../mock/training';
import { getOverallPerformance, getTrendDirection } from '../../mock/performance';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../contexts/NavContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setPage } = useNavigation();
  useEffect(() => { setPage('dashboard'); }, [setPage]);

  // ── Compute attendance KPIs from real records ──
  const records = useMemo(
    () => getAttendanceRecords(user?._id ?? 'demo-student'),
    [user?._id],
  );
  const attendancePercent = useMemo(() => {
    const eligible = records.filter((r) => r.status !== 'excused');
    if (eligible.length === 0) return 0;
    const attended = eligible.filter(
      (r) => r.status === 'present' || r.status === 'late',
    ).length;
    return Math.round((attended / eligible.length) * 100);
  }, [records]);

  const streak = useMemo(() => {
    const sorted = [...records]
      .filter((r) => r.status === 'present' || r.status === 'late')
      .sort((a, b) => b.markedAt.localeCompare(a.markedAt));
    if (sorted.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    for (const { markedAt } of sorted) {
      if (markedAt.split('T')[0] <= today) count++;
      else break;
    }
    return count;
  }, [records]);

  const belt = user?.belt || mockData.belt;
  const overallPerf = useMemo(() => getOverallPerformance(), []);
  const trendDir = useMemo(() => getTrendDirection(), []);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .slice(0, 3)
      .map((e) => {
        const d = new Date(e.date + 'T00:00:00');
        const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        const tagMap: Record<string, string> = {
          training: 'Training',
          'special-training': 'Special',
          tournament: 'Tournament',
          'belt-grading': 'Grading',
          holiday: 'Holiday',
          'academy-event': 'Event',
        };
        return {
          id: e.id,
          month: monthNames[d.getMonth()],
          day: d.getDate(),
          title: e.name,
          meta: `${e.startTime} – ${e.location}`,
          tag: tagMap[e.type] || 'Event',
        };
      });
  }, [todayStr]);

  const d = mockData;
  const videos = useMemo(() => getTrainingVideos().slice(0, 3), []);
  const announcements = useMemo(() => getRecentAnnouncements(3), []);

  return (
    <AppShell>
      <div className="tkd-dash-page">
        <div className="tkd-dash-content">

          {/* ── Hero ── */}
          <HeroBanner userName={user?.firstName} />

          {/* ── Stat Cards ── */}
          <div className="tkd-stats-row">
            <button
              className="tkd-stat tkd-stat--red"
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => navigate('/app/attendance')}
              type="button"
            >
              <div className="tkd-stat-icon">
                <CalendarCheck size={22} strokeWidth={2} />
              </div>
              <div className="tkd-stat-info">
                <div className="tkd-stat-label">Attendance</div>
                <div className="tkd-stat-value">{attendancePercent}%</div>
                <span className="tkd-stat-foot green">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                  From last month
                </span>
              </div>
            </button>
            <button
              className="tkd-stat tkd-stat--blue"
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => navigate('/app/performance')}
              type="button"
            >
              <div className="tkd-stat-icon">
                <BarChart3 size={22} strokeWidth={2} />
              </div>
              <div className="tkd-stat-info">
                <div className="tkd-stat-label">Performance</div>
                <div className="tkd-stat-value tkd-stat-value--blue">
                  {overallPerf}%
                </div>
                <span className={`tkd-stat-foot ${trendDir === 'up' ? 'green' : trendDir === 'down' ? 'warm' : 'muted'}`}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points={trendDir === 'up' ? '18 15 12 9 6 15' : trendDir === 'down' ? '6 9 12 15 18 9' : '6 12 18 12'} />
                  </svg>
                  {trendDir === 'up' ? 'Improving' : trendDir === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </button>
            <button
              className="tkd-stat tkd-stat--purple"
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => navigate('/app/performance')}
              type="button"
            >
              <div className="tkd-stat-icon">
                <Medal size={22} strokeWidth={2} />
              </div>
              <div className="tkd-stat-info">
                <div className="tkd-stat-label">Current Belt</div>
                <div className="tkd-stat-value">{belt}</div>
                <div className="tkd-stat-foot muted">Next: {d.nextBelt}</div>
              </div>
            </button>
            <button
              className="tkd-stat tkd-stat--orange"
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => navigate('/app/attendance')}
              type="button"
            >
              <div className="tkd-stat-icon">
                <Flame size={22} strokeWidth={2} />
              </div>
              <div className="tkd-stat-info">
                <div className="tkd-stat-label">Training Streak</div>
                <div className="tkd-stat-value">{streak} Days</div>
                <span className="tkd-stat-foot warm">Keep it up!</span>
              </div>
              <Flame
                className="tkd-stat-deco"
                size={40}
                color="#f6c48f"
                fill="#f6c48f"
              />
            </button>
          </div>

          {/* ── Videos + Calendar (2-col) ── */}
          <div className="tkd-dash-2col">
            <div className="tkd-dash-left">
              <VideoRow videos={videos} onNavigate={(path) => navigate(path)} />
            </div>
            <div className="tkd-dash-right">
              <CalendarWidget
                events={events}
                today={today.getDate()}
                defaultMonth={today.getMonth()}
                defaultYear={today.getFullYear()}
                onNavigate={() => navigate('/app/schedule')}
                onViewAll={() => navigate('/app/schedule')}
              />
            </div>
          </div>

          {/* ── Bottom row: Announcements + Top Students + Upcoming Events ── */}
          <div className="tkd-dash-bottom">
            <AnnouncementsCard announcements={announcements} onNavigate={() => navigate('/app/announcements')} />
            <LeaderboardCard entries={d.topStudents} onNavigate={() => navigate('/app/performance')} />
            <EventsCard events={upcomingEvents} onNavigate={() => navigate('/app/schedule')} />
          </div>

        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
