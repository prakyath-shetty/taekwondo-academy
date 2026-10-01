const NOW = new Date();
const Y = NOW.getFullYear();
const M = String(NOW.getMonth() + 1).padStart(2, '0');

const fmt = (day: number): string => `${Y}-${M}-${String(day).padStart(2, '0')}`;

export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  location: string;
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  category: string;
  beltLevel: string;
  description: string;
  registrationOpen: boolean;
  registrationDeadline: string;
  maxParticipants?: number;
  registered?: number;
  requirements?: string[];
  importantInfo?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export const tournaments: Tournament[] = [
  {
    id: 'tour-1',
    name: 'Korea National Taekwondo Championship 2026',
    organizer: 'Korea Taekwondo Association',
    location: 'Seoul Olympic Park Taekwondo Dome',
    date: fmt(NOW.getDate() + 5),
    startTime: '09:00',
    endTime: '17:00',
    category: 'Kyorugi (Sparring) — National',
    beltLevel: 'Green Belt and above',
    description: 'The premier national-level taekwondo sparring competition. Open to all certified members aged 16 and above. Categories include poomsae, sparring, and power breaking.',
    registrationOpen: true,
    registrationDeadline: fmt(NOW.getDate() + 3),
    maxParticipants: 256,
    registered: 189,
    requirements: ['Valid belt certificate', 'Completed registration form', 'Parent consent if under 18', 'Medical clearance'],
    importantInfo: 'Check in 30 minutes before your match. Bring water and sparring gear (hogu, headgear, shin guards).',
    status: 'upcoming',
  },
  {
    id: 'tour-2',
    name: 'District Taekwondo Open — Fall 2026',
    organizer: 'Bengaluru District Sports Council',
    location: 'Sri Chamarajendra Stadium, Bengaluru',
    date: fmt(NOW.getDate() + 18),
    endTime: '16:00',
    startTime: '08:00',
    category: 'Kyorugi + Poomsae — District Open',
    beltLevel: 'All belts (U12 / U15 / U18 / Senior)',
    description: 'An open district tournament welcoming participants from all clubs in the Bengaluru region. Includes separate age categories and both sparring and poomsae events.',
    registrationOpen: true,
    registrationDeadline: fmt(NOW.getDate() + 15),
    maxParticipants: 400,
    registered: 312,
    requirements: ['Club membership card', 'Photo ID', 'Completed entry form'],
    status: 'upcoming',
  },
  {
    id: 'tour-3',
    name: 'Blue Belt Grading & Exhibition Match',
    organizer: 'Seoul Central Dojang',
    location: 'Main Academy Hall',
    date: fmt(NOW.getDate() + 10),
    startTime: '14:00',
    endTime: '17:00',
    category: 'Internal Grading — Blue Belt',
    beltLevel: 'Green Belt (testing for Blue)',
    description: 'Internal belt grading session for Green Belt students seeking promotion to Blue Belt. Includes poomsae demonstration, techniques, and sparring exhibition.',
    registrationOpen: true,
    registrationDeadline: fmt(NOW.getDate() + 7),
    requirements: ['Current Green Belt certification', 'Completed training log (min. 3 months)', 'Coach recommendation'],
    importantInfo: 'Parents are welcome to observe. Bring grading fee payment.',
    status: 'upcoming',
  },
  {
    id: 'tour-4',
    name: 'Asian Youth Taekwondo Cup 2026',
    organizer: 'Asian Taekwondo Union',
    location: 'Bangkok Convention Center, Thailand',
    date: fmt(NOW.getDate() + 45),
    endDate: fmt(NOW.getDate() + 47),
    startTime: '09:00',
    endTime: '18:00',
    category: 'Kyorugi — Asian Youth International',
    beltLevel: 'Red Belt and above, ages 15–21',
    description: 'International youth taekwondo championship bringing together the best young athletes from across Asia. Selection trials required.',
    registrationOpen: true,
    registrationDeadline: fmt(NOW.getDate() + 30),
    maxParticipants: 128,
    requirements: ['National team selection', 'Valid passport', 'Medical insurance covering international travel', 'Sponsorship letter'],
    importantInfo: 'Accommodation and flights provided for selected athletes. Tryouts held on the 15th of next month.',
    status: 'upcoming',
  },
  {
    id: 'tour-5',
    name: 'Summer Inter-Dojang Sparring League',
    organizer: 'Seoul Central Dojang',
    location: 'Main Academy Hall',
    date: fmt(NOW.getDate() - 30),
    endDate: fmt(NOW.getDate() - 28),
    startTime: '10:00',
    endTime: '16:00',
    category: 'Kyorugi — Internal League',
    beltLevel: 'Yellow – Brown Belt',
    description: 'End-of-summer internal sparring league. Round-robin format with bracket finals. Great preparation for upcoming belt gradings.',
    registrationOpen: false,
    registrationDeadline: fmt(NOW.getDate() - 35),
    status: 'completed',
  },
  {
    id: 'tour-6',
    name: 'National Poomsae Championship',
    organizer: 'Korea Taekwondo Association',
    location: 'Gocheok Sky Dome, Seoul',
    date: fmt(NOW.getDate() - 60),
    startTime: '09:00',
    endTime: '17:00',
    category: 'Poomsae — National',
    beltLevel: 'All belts',
    description: 'National-level poomsae competition featuring traditional forms evaluation by certified judges.',
    registrationOpen: false,
    registrationDeadline: fmt(NOW.getDate() - 65),
    status: 'completed',
  },
];

export function getTournamentById(id: string): Tournament | undefined {
  return tournaments.find((t) => t.id === id);
}

export function getUpcomingTournaments(): Tournament[] {
  return tournaments.filter((t) => t.status === 'upcoming');
}

export function getCompletedTournaments(): Tournament[] {
  return tournaments.filter((t) => t.status === 'completed');
}
