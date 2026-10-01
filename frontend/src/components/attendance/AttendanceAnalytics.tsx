import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import type { AttendanceRecord, ScheduleEvent } from '../../types';
import './AttendanceAnalytics.css';

interface AttendanceAnalyticsProps {
  events: ScheduleEvent[];
  records: AttendanceRecord[];
}

const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({ events, records }) => {
  // ── Join records with sessions ──
  const rows = useMemo(() => {
    return records.flatMap((record) => {
      const session = events.find((event) => event.id === record.sessionId);
      return session ? [{ record, session }] : [];
    });
  }, [records, events]);

  // ── Calculate KPIs ──
  const eligibleRecords = rows.filter(({ record }) => record.status !== 'excused');
  const attendedCount = eligibleRecords.filter(({ record }) => record.status === 'present' || record.status === 'late').length;
  const attendancePercent = eligibleRecords.length ? Math.round((attendedCount / eligibleRecords.length) * 100) : 0;
  const sessionsAttended = rows.filter(({ record }) => record.status === 'present' || record.status === 'late').length;
  const sessionsMissed = rows.filter(({ record }) => record.status === 'absent').length;

  // ── Calculate current streak (chronological) ──
  const streak = useMemo(() => {
    const sortedRows = [...rows]
      .filter(({ record }) => record.status === 'present' || record.status === 'late')
      .sort((a, b) => b.session.date.localeCompare(a.session.date));

    if (sortedRows.length === 0) return 0;

    let count = 0;
    const today = new Date().toISOString().split('T')[0];

    for (const { session } of sortedRows) {
      if (session.date <= today) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }, [rows]);

  // ── Monthly Attendance Trend ──
  const monthlyTrend = useMemo(() => {
    const monthMap = new Map<string, { attended: number; total: number }>();

    rows.forEach(({ record, session }) => {
      const monthKey = session.date.slice(0, 7); // YYYY-MM
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { attended: 0, total: 0 });
      }
      const entry = monthMap.get(monthKey)!;
      if (record.status !== 'excused') {
        entry.total++;
        if (record.status === 'present' || record.status === 'late') {
          entry.attended++;
        }
      }
    });

    const sorted = Array.from(monthMap.entries())
      .map(([month, { attended, total }]) => ({
        month,
        attended,
        total,
        percent: total > 0 ? Math.round((attended / total) * 100) : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    return sorted;
  }, [rows]);

  const maxPercent = Math.max(...monthlyTrend.map((m) => m.percent), 1);

  const formatMonthLabel = (month: string) => {
    const [, m] = month.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[parseInt(m, 10) - 1];
  };

  return (
    <section className="tkd-analytics" aria-label="Attendance analytics">
      <div className="tkd-analytics-header">
        <h2>Analytics</h2>
        <TrendingUp size={18} aria-hidden="true" />
      </div>

      {/* ── KPI Cards ── */}
      <div className="tkd-analytics-kpis">
        <article className="tkd-analytics-kpi">
          <span className="tkd-analytics-kpi-label">Attendance rate</span>
          <strong className="tkd-analytics-kpi-value">{attendancePercent}%</strong>
        </article>
        <article className="tkd-analytics-kpi">
          <span className="tkd-analytics-kpi-label">Sessions attended</span>
          <strong className="tkd-analytics-kpi-value">{sessionsAttended}</strong>
        </article>
        <article className="tkd-analytics-kpi">
          <span className="tkd-analytics-kpi-label">Sessions missed</span>
          <strong className="tkd-analytics-kpi-value">{sessionsMissed}</strong>
        </article>
        <article className="tkd-analytics-kpi">
          <span className="tkd-analytics-kpi-label">Current streak</span>
          <strong className="tkd-analytics-kpi-value">{streak}</strong>
        </article>
      </div>

      {/* ── Monthly Trend ── */}
      {monthlyTrend.length > 0 && (
        <div className="tkd-analytics-trend">
          <h3>Monthly attendance trend</h3>
          <div className="tkd-analytics-chart">
            {monthlyTrend.map(({ month, percent }) => (
              <div className="tkd-analytics-bar-wrapper" key={month}>
                <div
                  className="tkd-analytics-bar"
                  style={{ height: `${(percent / maxPercent) * 100}%` }}
                  title={`${formatMonthLabel(month)}: ${percent}%`}
                >
                  <span className="tkd-analytics-bar-label">{percent}%</span>
                </div>
                <span className="tkd-analytics-bar-month">{formatMonthLabel(month)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AttendanceAnalytics;
