export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // Profile fields (populated after Phase 2 backend)
  phone?: string;
  belt?: string;
  level?: string;
  joinDate?: string;
  academy?: string;
  coach?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface IAuthResponse {
  success: boolean;
  data?: { user: IUser; token: string };
  message?: string;
}

export interface IApiError {
  success: false;
  message: string;
  errors?: string[];
}

// ── Schedule Types ──
export type EventType = 'training' | 'special-training' | 'tournament' | 'belt-grading' | 'holiday' | 'academy-event';
export type EventStatus = 'upcoming' | 'today' | 'ongoing' | 'past';

export interface ScheduleEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;          // ISO date YYYY-MM-DD
  startTime: string;     // HH:mm
  endTime: string;       // HH:mm
  location: string;
  coach?: string;
  focus?: string;        // training focus
  description?: string;
  category?: string;     // tournament category
  beltLevel?: string;    // belt grading level
  requirements?: string; // belt grading / tournament requirements
  equipment?: string;    // required equipment for special training
  organizer?: string;    // academy event organizer
  registrationOpen?: boolean;
  registrationDeadline?: string;
  importantInfo?: string;
  registrationStatus?: 'registered' | 'not-attending';
  studentsAttending?: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: ScheduleEvent['id'];
  status: AttendanceStatus;
  markedAt: string;
  coachNote?: string;
}

// ── Dashboard mock data types ──
export interface IUpcomingEvent {
  id: string;
  day: string;
  time: string;
  name: string;
  coach: string;
  location: string;
}

export interface ITrainingActivity {
  id: string;
  name: string;
  completedAt: string;
  duration: string;
}

export interface IVideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export interface IAnnouncement {
  id: string;
  badge: 'red' | 'blue' | 'green' | 'orange';
  text: string;
}

export interface IActivityLog {
  id: string;
  icon: string;
  text: string;
  time: string;
}

export interface IDashboardData {
  attendance: number;
  performance: number;
  streak: number;
  belt: string;
  upcoming: IUpcomingEvent[];
  recentTraining: ITrainingActivity[];
  videos: IVideoItem[];
  announcements: IAnnouncement[];
  activity: IActivityLog[];
}
