import type { AttendanceRecord, AttendanceStatus } from '../types';
import events from './schedule';

type AttendanceFixture = {
  id: string;
  sessionId: AttendanceRecord['sessionId'];
  status: AttendanceStatus;
  coachNote?: string;
};

const fixtures: AttendanceFixture[] = [
  // ── September 2026 ──
  { id: 'attendance-01', sessionId: '1', status: 'present' },
  { id: 'attendance-11', sessionId: '11', status: 'present' },
  { id: 'attendance-21', sessionId: '21', status: 'present' },
  { id: 'attendance-22', sessionId: '22', status: 'present' },
  { id: 'attendance-23', sessionId: '23', status: 'present' },
  { id: 'attendance-24', sessionId: '24', status: 'present' },
  { id: 'attendance-25', sessionId: '25', status: 'present' },
  { id: 'attendance-26', sessionId: '26', status: 'present' },
  { id: 'attendance-27', sessionId: '27', status: 'late', coachNote: 'Arrived 10 minutes late.' },
  { id: 'attendance-28', sessionId: '28', status: 'present' },
  { id: 'attendance-29', sessionId: '29', status: 'present' },
  { id: 'attendance-30', sessionId: '30', status: 'present' },

  // ── August 2026 ──
  { id: 'attendance-31', sessionId: '31', status: 'present' },
  { id: 'attendance-32', sessionId: '32', status: 'present' },
  { id: 'attendance-33', sessionId: '33', status: 'absent' },
  { id: 'attendance-34', sessionId: '34', status: 'present' },
  { id: 'attendance-35', sessionId: '35', status: 'present' },
  { id: 'attendance-36', sessionId: '36', status: 'late', coachNote: 'Arrived after warm-up.' },
  { id: 'attendance-37', sessionId: '37', status: 'excused', coachNote: 'Medical appointment — excused by academy.' },
  { id: 'attendance-38', sessionId: '38', status: 'present' },

  // ── July 2026 ──
  { id: 'attendance-39', sessionId: '39', status: 'present' },
  { id: 'attendance-40', sessionId: '40', status: 'present' },
  { id: 'attendance-41', sessionId: '41', status: 'present' },
  { id: 'attendance-42', sessionId: '42', status: 'absent' },
  { id: 'attendance-43', sessionId: '43', status: 'present' },
  { id: 'attendance-44', sessionId: '44', status: 'present' },
  { id: 'attendance-45', sessionId: '45', status: 'present' },
];

export const getAttendanceRecords = (studentId: string): AttendanceRecord[] =>
  fixtures.flatMap((fixture) => {
    const session = events.find((event) => event.id === fixture.sessionId);
    if (!session) return [];

    const markedAt = new Date(`${session.date}T${session.endTime}:00`);
    markedAt.setMinutes(markedAt.getMinutes() + 10);

    return [{ ...fixture, studentId, markedAt: markedAt.toISOString() }];
  });

export const getAttendanceForSession = (
  studentId: string,
  sessionId: AttendanceRecord['sessionId'],
): AttendanceRecord | undefined =>
  getAttendanceRecords(studentId).find((record) => record.sessionId === sessionId);
