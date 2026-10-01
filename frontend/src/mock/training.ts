export interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  uploadedAt: string;
}

const trainingVideos: TrainingVideo[] = [
  {
    id: '1',
    title: 'Advanced Roundhouse Kick',
    description: 'Learn the correct technique and form for the advanced roundhouse kick. Covers hip rotation, chamber position, and follow-through.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    duration: '08:24',
    uploadedAt: '2026-09-25',
  },
  {
    id: '2',
    title: 'Taegeuk 2 Poomsae Guide',
    description: 'Step by step walkthrough of Taegeuk 2 Poomsae. Focus on correct stances, transitions, and breathing patterns.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    duration: '12:16',
    uploadedAt: '2026-09-20',
  },
  {
    id: '3',
    title: 'Sparring Footwork Fundamentals',
    description: 'Master the basic footwork patterns used in sparring. Covers angle changes, distance management, and lateral movement.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    duration: '10:45',
    uploadedAt: '2026-09-15',
  },
  {
    id: '4',
    title: 'Basic Stances & Kicks for White Belts',
    description: 'Foundational tutorial for new students. Learn front stance, ready stance, and basic front kick technique.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    uploadedAt: '2026-09-10',
  },
  {
    id: '5',
    title: 'Flexibility & Stretching Routine',
    description: 'Essential stretching exercises to improve flexibility and prevent injuries. Recommended before and after every training session.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    uploadedAt: '2026-09-05',
  },
  {
    id: '6',
    title: 'Jumping Turn Kick Technique',
    description: 'Advanced jumping turn kick breakdown. Covers takeoff, rotation in the air, and landing position.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    uploadedAt: '2026-08-28',
  },
  {
    id: '7',
    title: 'Self-Defense Basics',
    description: 'Practical self-defense techniques for everyday situations. Grappling escapes and strike defense.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    uploadedAt: '2026-08-20',
  },
  {
    id: '8',
    title: 'Belt Grading Poomsae — Blue Belt',
    description: 'Complete poomsae routine required for blue belt grading. Slow and fast variations included.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    uploadedAt: '2026-08-15',
  },
  {
    id: '9',
    title: 'Conditioning for Taekwondo',
    description: 'Core strength, explosive power, and endurance exercises specifically designed for taekwondo athletes.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '',
    uploadedAt: '2026-08-08',
  },
];

export function getTrainingVideos(): TrainingVideo[] {
  return trainingVideos;
}

export default trainingVideos;
