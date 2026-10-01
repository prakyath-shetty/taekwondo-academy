export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: 'event' | 'training' | 'poomsae' | 'sparring' | 'award' | 'facility';
  date: string;
  photographer: string;
  // Using placeholder colors as stand-ins for actual image URLs
  color: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'gal-1',
    title: 'National Championship 2026',
    description: 'Team photo from the Korea National Taekwondo Championship held at Seoul Olympic Park.',
    category: 'event',
    date: '2026-08-15',
    photographer: 'Academy Photo Team',
    color: '#1e3a5e',
  },
  {
    id: 'gal-2',
    title: 'Poomsae Performance — Blue Belt',
    description: 'Blue Belt candidates performing Taegeuk 4 during the mid-year assessment.',
    category: 'poomsae',
    date: '2026-06-20',
    photographer: 'Coach Park',
    color: '#3a1e5e',
  },
  {
    id: 'gal-3',
    title: 'Sparring Drill — Advanced Class',
    description: 'Advanced students practicing combination sparring footwork under Coach Lee supervision.',
    category: 'sparring',
    date: '2026-09-05',
    photographer: 'Academy Photo Team',
    color: '#1e5e3a',
  },
  {
    id: 'gal-4',
    title: 'Award Ceremony — District Champion',
    description: 'Min-jun receiving the gold medal at the District Taekwondo Open ceremony.',
    category: 'award',
    date: '2026-04-20',
    photographer: 'District Sports Council',
    color: '#5e3a1e',
  },
  {
    id: 'gal-5',
    title: 'Main Training Hall',
    description: 'The freshly renovated Main Academy Hall with new tatami mats and mirror walls.',
    category: 'facility',
    date: '2026-01-10',
    photographer: 'Academy Admin',
    color: '#1e3a4a',
  },
  {
    id: 'gal-6',
    title: 'Children Fundamentals Class',
    description: 'Young students (ages 6–10) learning basic stances and kicks during weekend fundamentals.',
    category: 'training',
    date: '2026-09-12',
    photographer: 'Coach Kim',
    color: '#4a1e3a',
  },
  {
    id: 'gal-7',
    title: 'Belt Grading — Poomsae Test',
    description: 'Green Belt students performing Taegeuk 3 for their advancement assessment.',
    category: 'poomsae',
    date: '2026-03-15',
    photographer: 'Head Instructor Choi',
    color: '#3a4a1e',
  },
  {
    id: 'gal-8',
    title: 'Summer Camp Group Photo',
    description: 'All participants of the annual summer taekwondo camp posing together after the closing ceremony.',
    category: 'event',
    date: '2026-07-25',
    photographer: 'Academy Photo Team',
    color: '#5e1e3a',
  },
  {
    id: 'gal-9',
    title: 'Sparring Exhibition Match',
    description: 'Coach Park and Coach Lee demonstrating advanced sparring techniques for the parent showcase.',
    category: 'sparring',
    date: '2026-05-10',
    photographer: 'Academy Photo Team',
    color: '#1e4a5e',
  },
  {
    id: 'gal-10',
    title: 'Black Belt Promotion Ceremony',
    description: 'Three students received their Black Belt certificates during the formal promotion ceremony.',
    category: 'award',
    date: '2026-02-28',
    photographer: 'Head Instructor Choi',
    color: '#2a2a3a',
  },
  {
    id: 'gal-11',
    title: 'Conditioning Session',
    description: 'Morning conditioning drills including sprint intervals and core work in the fitness room.',
    category: 'training',
    date: '2026-08-30',
    photographer: 'Coach Kim',
    color: '#3a2a1e',
  },
  {
    id: 'gal-12',
    title: 'Reception Area & Locker Rooms',
    description: 'The newly remodeled reception area with digital check-in kiosks and updated locker facilities.',
    category: 'facility',
    date: '2026-01-15',
    photographer: 'Academy Admin',
    color: '#2a3a4a',
  },
];

export function getImagesByCategory(category: GalleryImage['category']): GalleryImage[] {
  return galleryImages.filter((img) => img.category === category);
}

export function getImagesByDateRange(start: string, end: string): GalleryImage[] {
  return galleryImages.filter((img) => img.date >= start && img.date <= end);
}
