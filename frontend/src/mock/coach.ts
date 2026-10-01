export interface CoachMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  type: 'feedback' | 'schedule' | 'announcement' | 'general';
}

export interface CoachAvailability {
  id: string;
  coach: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  type: 'office-hours' | 'extra-training' | 'parent-meeting';
  notes?: string;
}

export const coachMessages: CoachMessage[] = [
  {
    id: 'msg-1',
    from: 'Coach Park',
    to: 'Min-jun Kim',
    subject: 'Sparring Technique Improvement',
    body: 'Min-jun, I noticed great improvement in your roundhouse kick timing during Tuesday\'s session. Keep focusing on hip rotation — it will add more power to your strikes. For the upcoming grading, I want you to practice the combination: front kick to side kick to roundhouse. See you Wednesday.',
    date: '2026-09-28',
    read: true,
    type: 'feedback',
  },
  {
    id: 'msg-2',
    from: 'Coach Lee',
    to: 'Min-jun Kim',
    subject: 'Tournament Registration Confirmation',
    body: 'Your registration for the Korea National Taekwondo Championship on October 5 has been confirmed. Please remember to bring your belt certificate and complete the medical declaration form before check-in. Expected arrival time: 8:30 AM.',
    date: '2026-09-25',
    read: true,
    type: 'schedule',
  },
  {
    id: 'msg-3',
    from: 'Head Instructor Choi',
    to: 'All Students',
    subject: 'October Training Schedule Adjustment',
    body: 'Due to the national holiday on October 2, all classes on that day are cancelled. Additionally, the special sparring workshop originally scheduled for October 3 has been moved to October 4 at the same time (6:00–8:00 PM). Please adjust your calendars accordingly.',
    date: '2026-09-22',
    read: false,
    type: 'announcement',
  },
  {
    id: 'msg-4',
    from: 'Coach Park',
    to: 'Min-jun Kim',
    subject: 'Poomsae Refinement Notes',
    body: 'Your Taegeuk 4 poomsae is looking solid. A few adjustments for the grading: 1) Pause slightly longer at the finishing stance, 2) Ensure your front block reaches full extension, 3) Breathe out sharply on each strike. Practice these points at home and we\'ll review next session.',
    date: '2026-09-20',
    read: false,
    type: 'feedback',
  },
  {
    id: 'msg-5',
    from: 'Coach Kim',
    to: 'Min-jun Kim',
    subject: 'Flexibility Program — Weekly Check-in',
    body: 'Min-jun, I\'d like to check in on your flexibility routine. Are you doing the stretching exercises I gave you last week? Remember: 10 minutes before every training session, focus on hip openers and hamstring stretches. Your jumping turn kick will improve significantly with better flexibility.',
    date: '2026-09-18',
    read: true,
    type: 'general',
  },
];

export const coachAvailability: CoachAvailability[] = [
  {
    id: 'avail-1',
    coach: 'Coach Park',
    dayOfWeek: 'Monday',
    startTime: '16:00',
    endTime: '17:00',
    type: 'office-hours',
    notes: 'One-on-one technique consultation available.',
  },
  {
    id: 'avail-2',
    coach: 'Coach Lee',
    dayOfWeek: 'Wednesday',
    startTime: '19:00',
    endTime: '20:00',
    type: 'extra-training',
    notes: 'Advanced sparring extra session.',
  },
  {
    id: 'avail-3',
    coach: 'Head Instructor Choi',
    dayOfWeek: 'Friday',
    startTime: '15:00',
    endTime: '16:30',
    type: 'parent-meeting',
    notes: 'Parent-teacher consultation hours. Appointment recommended.',
  },
  {
    id: 'avail-4',
    coach: 'Coach Kim',
    dayOfWeek: 'Saturday',
    startTime: '10:00',
    endTime: '11:00',
    type: 'office-hours',
    notes: 'Flexibility and conditioning assessment available.',
  },
];

export function getUnreadMessageCount(): number {
  return coachMessages.filter((m) => !m.read).length;
}

export function getMessagesByType(type: CoachMessage['type']): CoachMessage[] {
  return coachMessages.filter((m) => m.type === type);
}
