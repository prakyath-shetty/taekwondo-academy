export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  author: string;
  tags: string[];
}

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Training Holiday — October 2',
    body: 'There will be NO training on October 2 (Gandhi Jayanti). All classes are cancelled for the day. Regular schedule resumes October 3.',
    date: '2026-09-20',
    priority: 'high',
    author: 'Academy Administration',
    tags: ['holiday', 'schedule'],
  },
  {
    id: 'ann-2',
    title: 'Belt Grading — October 10',
    body: 'Belt grading examinations will be conducted on October 10 at 2:00 PM in the Main Academy Hall. Green and Blue Belt candidates must register by October 7. Bring your belt certificate and uniform.',
    date: '2026-09-18',
    priority: 'high',
    author: 'Head Instructor Choi',
    tags: ['grading', 'registration'],
  },
  {
    id: 'ann-3',
    title: 'District Championship Registration Open',
    body: 'Registration for the District Taekwondo Open (October 18) is now open. Limited to 400 participants. Early registration closes October 13. Visit the front desk or register through your coach.',
    date: '2026-09-15',
    priority: 'medium',
    author: 'Coach Park',
    tags: ['tournament', 'registration'],
  },
  {
    id: 'ann-4',
    title: 'New Poomsae Curriculum Starting November',
    body: 'Starting November 1, we will begin teaching Taegeuk 6 and 7 Poomsae to advanced students. Yellow and Green Belt students will start with Taegeuk 6. Check with your coach for placement.',
    date: '2026-09-12',
    priority: 'low',
    author: 'Curriculum Committee',
    tags: ['training', 'curriculum'],
  },
  {
    id: 'ann-5',
    title: 'Sparring Gear Required for Advanced Classes',
    body: 'All students attending Advanced Taekwondo Training (Wednesdays 5:30–7:30 PM) must bring full sparring gear including hogu, headgear, shin guards, and mouth guard. Gear is available for rent at the front desk.',
    date: '2026-09-10',
    priority: 'medium',
    author: 'Coach Lee',
    tags: ['equipment', 'training'],
  },
  {
    id: 'ann-6',
    title: 'Parent Orientation — October 5',
    body: 'We invite all parents and guardians to the quarterly parent orientation on October 5 at 4:00 PM. Topics include training progress, upcoming events, and how you can support your child\'s taekwondo journey.',
    date: '2026-09-08',
    priority: 'low',
    author: 'Academy Administration',
    tags: ['parent', 'event'],
  },
  {
    id: 'ann-7',
    title: 'Youth League Tryouts — Next Month',
    body: 'Tryouts for the Asian Youth Taekwondo Cup national squad will be held on the 15th of next month. Eligible: Red Belt and above, ages 15–21. Interested students should speak with Coach Park before October 10.',
    date: '2026-09-05',
    priority: 'medium',
    author: 'Coach Park',
    tags: ['tryout', 'national'],
  },
];

export function getAnnouncementsByPriority(priority: Announcement['priority']): Announcement[] {
  return announcements.filter((a) => a.priority === priority);
}

export function getRecentAnnouncements(count = 3): Announcement[] {
  return [...announcements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);
}
