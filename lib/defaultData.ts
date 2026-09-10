import { Student, Project, Faculty } from './types';

export const DEFAULT_FACULTY: Faculty[] = [
  {
    id: 'fac-vincent',
    name: 'Vincent Antony',
    designation: 'Assistant Professor & AI Program Coordinator',
    qualification: 'M.Tech in Artificial Intelligence, Ph.D. Scholar',
    specialization: 'Machine Learning, Computer Vision & Edge AI',
    experience: '8+ Years Experience in AI Research & Autonomous Systems',
    email: 'vincent.antony@sbcollege.ac.in',
    phone: '+91 481 2420025',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    researchInterests: [
      'Malayalam Natural Language Processing',
      'Computer Vision for Precision Agriculture',
      'Embedded AI & Edge Intelligence',
      'Deep Learning & RAG Architectures'
    ],
    portfolioUrl: 'https://sbcollege.ac.in',
    order: 1,
  }
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'stu-vincent',
    name: 'Vincent Antony',
    rollNo: '401',
    batch: 'B.Sc. AI & DS (2026 - 2030)',
    bloodGroup: 'O+ve',
    email: 'vincent.antony@student.sbcollege.ac.in',
    phone: '+91 98470 12345',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    linkedIn: 'https://linkedin.com/in/vincent-antony',
    portfolioUrl: 'https://vincent-antony-ai.dev',
    skills: ['PyTorch', 'Computer Vision', 'Next.js', 'Python', 'OpenCV', 'Data Science', 'Machine Learning', 'NLP'],
    wings: ['tech_team', 'media_team', 'nss', 'ncc', 'sports'],
    bio: 'Department of AI & Data Science Innovator specializing in Malayalam Computer Vision, Full-Stack AI Development, and holistic campus leadership.',
    approvalStatus: 'approved',
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Malayalam Agri-Vision AI',
    description: 'Autonomous computer vision pipeline and Mobile App identifying crop diseases in pepper, rubber, and cardamom crops across Kerala farms using custom-trained YOLOv8 models.',
    category: 'Computer Vision',
    status: 'completed',
    teamMembers: ['Vincent Antony'],
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
    submittedBy: 'Vincent Antony',
    submittedAt: 'August 10, 2026',
    isApproved: true,
  },
  {
    id: 'proj-2',
    title: 'Smart Campus Edge Attendance & CCTV Analytics',
    description: 'Embedded camera system using Raspberry Pi 4 and edge tensor accelerators to automatically record autonomous classroom attendance with anti-spoofing liveness detection.',
    category: 'IoT & Edge AI',
    status: 'completed',
    teamMembers: ['Vincent Antony'],
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
    submittedBy: 'Vincent Antony',
    submittedAt: 'August 20, 2026',
    isApproved: true,
  }
];
