export interface Notification {
  id: string;
  type: 'training' | 'attendance' | 'tournament' | 'grading' | 'academy';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n-1',
    type: 'training',
    title: 'Training Tomorrow',
    body: 'Advanced Taekwondo Training starts at 5:30 PM today. Don\'t forget your gear.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n-2',
    type: 'attendance',
    title: 'Attendance Alert',
    body: 'You missed last Tuesday\'s session. Please check in with your coach.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 'n-3',
    type: 'tournament',
    title: 'Tournament Registration Open',
    body: 'District Championship registration is now open. Limited spots available.',
    time: '3 hours ago',
    read: false,
  },
  {
    id: 'n-4',
    type: 'grading',
    title: 'Belt Grading This Week',
    body: 'Belt grading examinations will be conducted on October 10 at 2:00 PM.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'n-5',
    type: 'academy',
    title: 'Academy Closed October 2',
    body: 'No training on October 2 (Gandhi Jayanti). Regular schedule resumes October 3.',
    time: '2 days ago',
    read: true,
  },
];

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}
