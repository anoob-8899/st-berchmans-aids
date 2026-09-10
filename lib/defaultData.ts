import { Student, Project, Faculty } from './types';

export const DEFAULT_FACULTY: Faculty[] = [];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'stu-kevin-paul',
    name: 'Kevin Paul',
    rollNo: '260101',
    batch: 'B.Sc. AI & DS (2026 - 2030)',
    bloodGroup: 'O+ve',
    email: 'kevin.paul@student.sbcollege.ac.in',
    photo: '/images/sb college logo.jpg',
    skills: ['Python', 'PyTorch', 'Data Structures', 'Computer Vision'],
    wings: ['tech_team', 'media_team'],
    bio: 'B.Sc. AI & Data Science student passionate about Computer Vision, Deep Learning, and open-source campus initiatives.',
    approvalStatus: 'approved',
    linkedIn: 'https://linkedin.com',
    portfolioUrl: 'https://github.com'
  },
  {
    id: 'stu-anjali-nair',
    name: 'Anjali Nair',
    rollNo: '260102',
    batch: 'B.Sc. AI & DS (2026 - 2030)',
    bloodGroup: 'A+ve',
    email: 'anjali.nair@student.sbcollege.ac.in',
    photo: '/images/sb college logo.jpg',
    skills: ['Machine Learning', 'SQL', 'Tableau', 'NLP'],
    wings: ['tech_team', 'nss'],
    bio: 'Data Science enthusiast focusing on natural language processing for regional languages and community tech outreach.',
    approvalStatus: 'approved',
    linkedIn: 'https://linkedin.com'
  },
  {
    id: 'stu-rahul-r',
    name: 'Rahul R',
    rollNo: '260103',
    batch: 'B.Sc. AI & DS (2026 - 2030)',
    bloodGroup: 'B+ve',
    email: 'rahul.r@student.sbcollege.ac.in',
    photo: '/images/sb college logo.jpg',
    skills: ['FastAPI', 'Next.js', 'PyTorch', 'Edge AI'],
    wings: ['sports', 'tech_team'],
    bio: 'Full-stack AI developer building edge intelligence solutions for campus analytics.',
    approvalStatus: 'approved'
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Malayalam Agri-Vision AI',
    description: 'Autonomous computer vision pipeline and Mobile App identifying crop diseases in pepper, rubber, and cardamom crops across Kerala farms using custom-trained YOLOv8 models.',
    category: 'Computer Vision',
    status: 'completed',
    teamMembers: ['AI & DS Department Team'],
    techStack: ['PyTorch', 'YOLOv8', 'OpenCV', 'React Native', 'FastAPI'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
    githubUrl: 'https://github.com/sb-aids/agri-vision-malayalam',
    demoUrl: 'https://agri-vision.sbcollege.ac.in',
    documentationUrl: 'https://github.com/sb-aids/agri-vision-malayalam/wiki',
    rating: 5.0,
    ratingCount: 18,
    comments: [
      {
        id: 'c-1',
        projectId: 'proj-1',
        userName: 'Chief Administrator',
        userRole: 'admin',
        rating: 5,
        comment: 'Outstanding practical application of computer vision for local agricultural challenges in Kottayam district.',
        createdAt: '2026-08-15',
        approved: true,
      }
    ],
    submittedBy: 'Department Tech Team',
    submittedAt: 'August 10, 2026',
    isApproved: true,
  },
  {
    id: 'proj-2',
    title: 'Smart Campus Edge Attendance & CCTV Analytics',
    description: 'Embedded camera system using Raspberry Pi 4 and edge tensor accelerators to automatically record autonomous classroom attendance with anti-spoofing liveness detection.',
    category: 'IoT & Edge AI',
    status: 'completed',
    teamMembers: ['AI & DS Department Team'],
    techStack: ['TensorFlow Lite', 'Raspberry Pi', 'OpenCV', 'Next.js', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
    githubUrl: 'https://github.com/sb-aids/smart-attendance-edge',
    demoUrl: 'https://attendance.sbcollege.ac.in',
    rating: 4.9,
    ratingCount: 12,
    comments: [
      {
        id: 'c-2',
        projectId: 'proj-2',
        userName: 'Chief Administrator',
        userRole: 'admin',
        rating: 5,
        comment: 'Successfully piloted in Centenary Lab with over 99.4% accuracy.',
        createdAt: '2026-08-22',
        approved: true,
      }
    ],
    submittedBy: 'Department Tech Team',
    submittedAt: 'August 20, 2026',
    isApproved: true,
  }
];
