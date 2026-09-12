import { z } from 'zod';

export const RoleEnum = z.enum(['STUDENT', 'FACULTY', 'ADMIN']);
export const AccountStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

export const LoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  batch: z.string().default('2026-2030'),
  registerNumber: z.string().optional(),
});

export const UserStatusUpdateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  status: AccountStatusEnum.optional(),
  role: RoleEnum.optional(),
});

export const UserAccountUpdateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  status: AccountStatusEnum.optional(),
  role: RoleEnum.optional(),
});

export const FacultyProvisionSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Valid institutional email is required'),
  name: z.string().min(2, 'Faculty name is required'),
  designation: z.string().min(2, 'Designation is required'),
  degrees: z.string().min(2, 'Degrees are required'),
  experience: z.string().min(1, 'Experience is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  initials: z.string().min(1).max(5),
  phone: z.string().optional(),
  publications: z.string().optional(),
});

export const StudentProfileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  registerNumber: z.string().optional().or(z.literal('')),
  batch: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  semester: z.number().int().min(1).max(8).optional(),
});

export const FacultyProfileSchema = z.object({
  name: z.string().min(2, 'Faculty name is required'),
  designation: z.string().min(2, 'Designation is required'),
  degrees: z.string().min(2, 'Degrees are required'),
  experience: z.string().min(1, 'Experience is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  publications: z.string().optional(),
  email: z.string().email('Valid institutional email is required'),
  phone: z.string().optional(),
  initials: z.string().min(1).max(5),
  avatarUrl: z.string().optional().or(z.literal('')),
  displayOrder: z.number().int().default(0),
});

export const SubjectSchema = z.object({
  code: z.string().min(2, 'Course code is required'),
  name: z.string().min(3, 'Course name is required'),
  semester: z.number().int().min(1).max(8),
  description: z.string().optional(),
  credits: z.number().int().min(1).max(6).default(3),
});

export const AcademicNoteSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  subjectId: z.string().optional(),
  subjectName: z.string().min(2, 'Subject name is required'),
  semester: z.number().int().min(1).max(8),
  fileUrl: z.string().min(1, 'Valid file URL or path is required'),
  fileType: z.string().default('PDF'),
  fileSize: z.string().optional(),
  approved: z.boolean().default(true),
});

export const StudentProjectSchema = z.object({
  title: z.string().min(3, 'Project title is required'),
  domain: z.string().min(2, 'Domain is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  description: z.string().optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  team: z.string().min(2, 'Team members description required'),
  isFeatured: z.boolean().default(false),
  approved: z.boolean().default(true),
});

export const CoCurricularWingSchema = z.object({
  name: z.string().min(3, 'Wing name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description is required'),
  icon: z.string().optional(),
});

export const CoCurricularMembershipSchema = z.object({
  studentProfileId: z.string().min(1, 'Student profile ID required'),
  wingId: z.string().min(1, 'Wing ID required'),
  role: z.string().default('Member'),
});

export const CoCurricularSelectionSchema = z.object({
  wingIds: z.array(z.string()),
});

export const EventSchema = z.object({
  title: z.string().min(3, 'Event title is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Event description is required'),
  venue: z.string().min(2, 'Venue is required'),
  eventDate: z.string().or(z.date()),
  category: z.string().default('ACADEMIC'),
  bannerUrl: z.string().optional().or(z.literal('')),
  registrationUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
});

export const GalleryItemSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  caption: z.string().optional().or(z.literal('')),
  imageUrl: z.string().min(1, 'Image URL or file path is required'),
  category: z.string().default('CAMPUS'),
});

export const ChatMessageSchema = z.object({
  sessionId: z.string().min(1, 'Session ID required'),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content required'),
  sources: z.string().optional(),
});

export const AdmissionEnquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  stream: z.string().min(1, 'Please select your stream'),
  marks: z.string().min(1, 'Please enter your +2 percentage or marks'),
  city: z.string().optional(),
});

export const TickerItemSchema = z.object({
  text: z.string().min(5, 'Announcement text must be at least 5 characters'),
  link: z.string().default('#'),
  isNew: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const SearchQuerySchema = z.object({
  q: z.string().max(100, 'Search query is too long').optional().default(''),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type AdmissionEnquiryInput = z.infer<typeof AdmissionEnquirySchema>;
export type StudentProfileUpdateInput = z.infer<typeof StudentProfileUpdateSchema>;
export type FacultyProfileInput = z.infer<typeof FacultyProfileSchema>;
export type AcademicNoteInput = z.infer<typeof AcademicNoteSchema>;
export type StudentProjectInput = z.infer<typeof StudentProjectSchema>;
export type EventInput = z.infer<typeof EventSchema>;
export type GalleryItemInput = z.infer<typeof GalleryItemSchema>;
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;
