export type Language = 'en' | 'ml';

export type UserRole = 'student' | 'faculty' | 'admin' | 'guest';

export type CollegeWing = 'nss' | 'ncc' | 'tech_team' | 'media_team' | 'sports' | 'other';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  batch: string;
  bloodGroup: string;
  email: string;
  phone?: string;
  photo: string;
  linkedIn?: string;
  portfolioUrl?: string;
  skills: string[];
  wings: CollegeWing[];
  bio: string;
  approvalStatus: 'approved' | 'pending';
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience: string;
  email: string;
  phone?: string;
  photo: string;
  researchInterests: string[];
  portfolioUrl?: string;
  order: number;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userName: string;
  userRole: UserRole;
  userPhoto?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  approved: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'upcoming' | 'completed';
  teamMembers: string[]; // names of students
  techStack: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  documentationUrl?: string;
  rating: number;
  ratingCount: number;
  comments: ProjectComment[];
  submittedBy: string;
  submittedAt: string;
  isApproved: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  registrationUrl?: string;
  posterImage: string;
  guestSpeaker?: string;
  status: 'upcoming' | 'completed';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  taggedStudentIds: string[]; // student IDs or names
  studentNames: string[];
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  semester: number;
  academicYear: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
}

export interface SyllabusItem {
  id: string;
  title: string;
  programme: string;
  academicYear: string;
  semester?: number;
  fileUrl: string;
  fileSize: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleMl?: string;
  date: string;
  category: 'academic' | 'event' | 'exam' | 'general';
  content: string;
  link?: string;
  isUrgent?: boolean;
}

export interface SkillHubCourse {
  id: string;
  title: string;
  partner: string;
  durationHours: number;
  mode: string;
  category: string;
  description: string;
}
