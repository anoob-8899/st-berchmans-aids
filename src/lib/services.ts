import { prisma } from './prisma';
import { hashPassword } from './auth';
import {
  SignupInput,
  StudentProfileUpdateInput,
  FacultyProfileInput,
  AcademicNoteInput,
  StudentProjectInput,
  EventInput,
  GalleryItemInput,
  SubjectSchema,
} from './validations';
import { z } from 'zod';

export class UserService {
  static async registerStudent(input: SignupInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: input.username },
          ...(input.email ? [{ email: input.email }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new Error('Username or Email already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email || null,
        passwordHash,
        role: 'STUDENT',
        status: 'PENDING',
        studentProfile: {
          create: {
            fullName: input.fullName,
            email: input.email || null,
            phone: input.phone || null,
            batch: input.batch || '2026-2030',
            registerNumber: input.registerNumber || null,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return user;
  }

  static async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });
  }

  static async getPendingAccounts() {
    return prisma.user.findMany({
      where: { status: 'PENDING' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        studentProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllUsers(status?: string) {
    return prisma.user.findMany({
      where: status ? { status } : undefined,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        studentProfile: true,
        facultyProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateAccountStatus(userId: string, status: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  static async updateAccount(userId: string, data: { status?: string; role?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.role ? { role: data.role } : {}),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  static async deleteAccount(targetUserId: string, currentAdminId: string) {
    if (targetUserId === currentAdminId) {
      throw new Error('CANNOT_DELETE_SELF');
    }
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new Error('NOT_FOUND');
    }
    return prisma.user.delete({
      where: { id: targetUserId },
    });
  }

  static async updateStudentProfileByAdmin(userId: string, input: StudentProfileUpdateInput) {
    return prisma.studentProfile.upsert({
      where: { userId },
      update: {
        fullName: input.fullName,
        registerNumber: input.registerNumber || null,
        batch: input.batch || '2026-2030',
        phone: input.phone || null,
        bio: input.bio || null,
        avatarUrl: input.avatarUrl || null,
        githubUrl: input.githubUrl || null,
        linkedinUrl: input.linkedinUrl || null,
        ...(input.semester ? { semester: input.semester } : {}),
      },
      create: {
        userId,
        fullName: input.fullName,
        registerNumber: input.registerNumber || null,
        batch: input.batch || '2026-2030',
        phone: input.phone || null,
        bio: input.bio || null,
        avatarUrl: input.avatarUrl || null,
        githubUrl: input.githubUrl || null,
        linkedinUrl: input.linkedinUrl || null,
        semester: input.semester || 1,
      },
    });
  }
}

export class StudentService {
  static async getProfileByUserId(userId: string) {
    return prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        coCurricularMemberships: {
          include: { wing: true },
        },
      },
    });
  }

  static async updateProfile(userId: string, input: StudentProfileUpdateInput) {
    return prisma.studentProfile.update({
      where: { userId },
      data: {
        fullName: input.fullName,
        registerNumber: input.registerNumber !== undefined ? (input.registerNumber || null) : undefined,
        batch: input.batch !== undefined ? (input.batch || '2026-2030') : undefined,
        phone: input.phone !== undefined ? (input.phone || null) : undefined,
        bio: input.bio !== undefined ? (input.bio || null) : undefined,
        avatarUrl: input.avatarUrl !== undefined ? (input.avatarUrl || null) : undefined,
        githubUrl: input.githubUrl !== undefined ? (input.githubUrl || null) : undefined,
        linkedinUrl: input.linkedinUrl !== undefined ? (input.linkedinUrl || null) : undefined,
        ...(input.semester ? { semester: input.semester } : {}),
      },
    });
  }

  static async addProject(studentProfileId: string, input: StudentProjectInput) {
    return prisma.studentProject.create({
      data: {
        studentProfileId,
        title: input.title,
        domain: input.domain,
        summary: input.summary,
        description: input.description || null,
        githubUrl: input.githubUrl || null,
        demoUrl: input.demoUrl || null,
        team: input.team,
        isFeatured: input.isFeatured ?? false,
        approved: input.approved ?? true,
      },
    });
  }

  static async updateProject(projectId: string, studentProfileId: string, input: StudentProjectInput) {
    const existing = await prisma.studentProject.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      throw new Error('NOT_FOUND');
    }

    if (existing.studentProfileId !== studentProfileId) {
      throw new Error('FORBIDDEN');
    }

    return prisma.studentProject.update({
      where: { id: projectId },
      data: {
        title: input.title,
        domain: input.domain,
        summary: input.summary,
        description: input.description || null,
        githubUrl: input.githubUrl || null,
        demoUrl: input.demoUrl || null,
        team: input.team,
        isFeatured: input.isFeatured ?? false,
      },
    });
  }

  static async deleteProject(projectId: string, studentProfileId: string) {
    const existing = await prisma.studentProject.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      throw new Error('NOT_FOUND');
    }

    if (existing.studentProfileId !== studentProfileId) {
      throw new Error('FORBIDDEN');
    }

    return prisma.studentProject.delete({
      where: { id: projectId },
    });
  }

  static async getAllWings() {
    return prisma.coCurricularWing.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async updateWings(studentProfileId: string, wingIds: string[]) {
    // Delete existing memberships and insert new selection
    await prisma.coCurricularMembership.deleteMany({
      where: { studentProfileId },
    });

    if (wingIds.length > 0) {
      await prisma.coCurricularMembership.createMany({
        data: wingIds.map((wingId) => ({
          studentProfileId,
          wingId,
          role: 'Member',
        })),
      });
    }

    return prisma.coCurricularMembership.findMany({
      where: { studentProfileId },
      include: { wing: true },
    });
  }

  static async getPublicProjects() {
    return prisma.studentProject.findMany({
      where: { approved: true },
      include: {
        studentProfile: {
          select: {
            fullName: true,
            batch: true,
          },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async getAllStudents(search?: string, semester?: number, batch?: string) {
    const where: any = {};
    if (semester) where.semester = semester;
    if (batch) where.batch = batch;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { registerNumber: { contains: search } },
        { email: { contains: search } },
      ];
    }
    return prisma.studentProfile.findMany({
      where,
      include: {
        user: { select: { username: true, status: true, role: true } },
        projects: true,
        coCurricularMemberships: { include: { wing: true } },
      },
      orderBy: [{ batch: 'desc' }, { fullName: 'asc' }],
    });
  }

  static async moderateProject(projectId: string, data: { approved?: boolean; isFeatured?: boolean }) {
    return prisma.studentProject.update({
      where: { id: projectId },
      data,
    });
  }

  static async deleteProjectByAdmin(projectId: string) {
    return prisma.studentProject.delete({
      where: { id: projectId },
    });
  }
}

export class FacultyService {
  static async getAllFaculty() {
    return prisma.facultyProfile.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getFacultyById(id: string) {
    return prisma.facultyProfile.findUnique({
      where: { id },
      include: { notes: { orderBy: { createdAt: 'desc' } } },
    });
  }

  static async getFacultyByUserId(userId: string, email?: string) {
    let profile = await prisma.facultyProfile.findUnique({
      where: { userId },
      include: { notes: { orderBy: { createdAt: 'desc' } } },
    });

    if (!profile && email) {
      profile = await prisma.facultyProfile.findUnique({
        where: { email },
        include: { notes: { orderBy: { createdAt: 'desc' } } },
      });
      if (profile && !profile.userId) {
        profile = await prisma.facultyProfile.update({
          where: { id: profile.id },
          data: { userId },
          include: { notes: { orderBy: { createdAt: 'desc' } } },
        });
      }
    }

    return profile;
  }

  static async updateOwnFacultyProfile(userId: string, email: string | undefined, input: FacultyProfileInput) {
    let profile = await this.getFacultyByUserId(userId, email);

    if (profile) {
      return prisma.facultyProfile.update({
        where: { id: profile.id },
        data: {
          name: input.name,
          designation: input.designation,
          degrees: input.degrees,
          experience: input.experience,
          specialization: input.specialization,
          publications: input.publications || null,
          phone: input.phone || null,
          initials: input.initials,
          avatarUrl: input.avatarUrl || null,
          displayOrder: input.displayOrder ?? profile.displayOrder,
        },
      });
    }

    // Create new profile linked to user if none exists
    return prisma.facultyProfile.create({
      data: {
        userId,
        name: input.name,
        email: input.email || email || '',
        designation: input.designation,
        degrees: input.degrees,
        experience: input.experience,
        specialization: input.specialization,
        publications: input.publications || null,
        phone: input.phone || null,
        initials: input.initials,
        avatarUrl: input.avatarUrl || null,
        displayOrder: input.displayOrder ?? 0,
      },
    });
  }

  static async upsertFaculty(input: FacultyProfileInput) {
    return prisma.facultyProfile.upsert({
      where: { email: input.email },
      update: {
        name: input.name,
        designation: input.designation,
        degrees: input.degrees,
        experience: input.experience,
        specialization: input.specialization,
        publications: input.publications || null,
        phone: input.phone || null,
        initials: input.initials,
        avatarUrl: input.avatarUrl || null,
        displayOrder: input.displayOrder,
      },
      create: {
        name: input.name,
        email: input.email,
        designation: input.designation,
        degrees: input.degrees,
        experience: input.experience,
        specialization: input.specialization,
        publications: input.publications || null,
        phone: input.phone || null,
        initials: input.initials,
        avatarUrl: input.avatarUrl || null,
        displayOrder: input.displayOrder,
      },
    });
  }

  static async provisionFacultyAccount(data: {
    username: string;
    email: string;
    password: string;
    name: string;
    designation: string;
    degrees: string;
    experience: string;
    specialization: string;
    initials: string;
    phone?: string;
    publications?: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: data.username }, { email: data.email }] },
    });
    if (existing) {
      throw new Error('Username or Email already registered');
    }

    const passwordHash = await hashPassword(data.password);

    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'FACULTY',
        status: 'APPROVED',
        facultyProfile: {
          create: {
            name: data.name,
            email: data.email,
            designation: data.designation,
            degrees: data.degrees,
            experience: data.experience,
            specialization: data.specialization,
            initials: data.initials,
            phone: data.phone || null,
            publications: data.publications || null,
          },
        },
      },
      include: { facultyProfile: true },
    });
  }

  static async deleteFacultyMember(id: string) {
    return prisma.facultyProfile.delete({
      where: { id },
    });
  }
}

export class AcademicService {
  static async getSubjects(semester?: number) {
    return prisma.subject.findMany({
      where: semester ? { semester } : undefined,
      orderBy: [{ semester: 'asc' }, { code: 'asc' }],
    });
  }

  static async createSubject(input: z.infer<typeof SubjectSchema>) {
    return prisma.subject.create({
      data: input,
    });
  }

  static async updateSubject(id: string, input: Partial<z.infer<typeof SubjectSchema>>) {
    return prisma.subject.update({
      where: { id },
      data: input,
    });
  }

  static async deleteSubject(id: string) {
    return prisma.subject.delete({
      where: { id },
    });
  }

  static async getNotes(params?: { semester?: number; subjectId?: string }) {
    return prisma.academicNote.findMany({
      where: {
        approved: true,
        ...(params?.semester ? { semester: params.semester } : {}),
        ...(params?.subjectId ? { subjectId: params.subjectId } : {}),
      },
      include: {
        subject: true,
        facultyProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getNotesByUploader(uploaderId: string) {
    return prisma.academicNote.findMany({
      where: { uploaderId },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllNotesAdmin() {
    return prisma.academicNote.findMany({
      include: {
        subject: true,
        uploader: { select: { username: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createNote(uploaderId: string, uploadedByName: string, input: AcademicNoteInput) {
    // Attempt to link facultyProfileId if available
    const faculty = await prisma.facultyProfile.findFirst({
      where: { OR: [{ userId: uploaderId }] },
    });

    return prisma.academicNote.create({
      data: {
        title: input.title,
        subjectId: input.subjectId || null,
        subjectName: input.subjectName,
        semester: input.semester,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSize: input.fileSize || null,
        uploaderId,
        facultyProfileId: faculty?.id || null,
        uploadedByName,
        approved: input.approved ?? true,
      },
    });
  }

  static async updateNote(noteId: string, uploaderId: string, isAdmin: boolean, input: Partial<AcademicNoteInput>) {
    const existing = await prisma.academicNote.findUnique({ where: { id: noteId } });
    if (!existing) throw new Error('NOT_FOUND');
    if (!isAdmin && existing.uploaderId !== uploaderId) throw new Error('FORBIDDEN');

    return prisma.academicNote.update({
      where: { id: noteId },
      data: {
        ...(input.title ? { title: input.title } : {}),
        ...(input.subjectName ? { subjectName: input.subjectName } : {}),
        ...(input.semester ? { semester: input.semester } : {}),
        ...(input.fileUrl ? { fileUrl: input.fileUrl } : {}),
        ...(input.approved !== undefined ? { approved: input.approved } : {}),
      },
    });
  }

  static async deleteNote(noteId: string, uploaderId: string, isAdmin: boolean) {
    const existing = await prisma.academicNote.findUnique({ where: { id: noteId } });
    if (!existing) throw new Error('NOT_FOUND');
    if (!isAdmin && existing.uploaderId !== uploaderId) throw new Error('FORBIDDEN');

    return prisma.academicNote.delete({
      where: { id: noteId },
    });
  }
}

export class EventService {
  static async getEvents(category?: string) {
    return prisma.event.findMany({
      where: category ? { category } : undefined,
      orderBy: { eventDate: 'asc' },
    });
  }

  static async createEvent(createdById: string, input: EventInput) {
    const eventDate = typeof input.eventDate === 'string' ? new Date(input.eventDate) : input.eventDate;
    return prisma.event.create({
      data: {
        title: input.title,
        slug: input.slug,
        description: input.description,
        venue: input.venue,
        eventDate,
        category: input.category,
        bannerUrl: input.bannerUrl || null,
        registrationUrl: input.registrationUrl || null,
        isFeatured: input.isFeatured,
        createdById,
      },
    });
  }

  static async updateEvent(eventId: string, input: EventInput) {
    const eventDate = typeof input.eventDate === 'string' ? new Date(input.eventDate) : input.eventDate;
    return prisma.event.update({
      where: { id: eventId },
      data: {
        title: input.title,
        slug: input.slug,
        description: input.description,
        venue: input.venue,
        eventDate,
        category: input.category,
        bannerUrl: input.bannerUrl || null,
        registrationUrl: input.registrationUrl || null,
        isFeatured: input.isFeatured,
      },
    });
  }

  static async deleteEvent(eventId: string) {
    return prisma.event.delete({
      where: { id: eventId },
    });
  }
}

export class GalleryService {
  static async getItems(category?: string) {
    return prisma.galleryItem.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getStudentUploads(uploaderId: string) {
    return prisma.galleryItem.findMany({
      where: { uploaderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createItem(uploaderId: string | null, input: GalleryItemInput) {
    return prisma.galleryItem.create({
      data: {
        title: input.title || null,
        caption: input.caption || null,
        imageUrl: input.imageUrl,
        category: input.category,
        uploaderId,
      },
    });
  }

  static async deleteItem(itemId: string, uploaderId: string) {
    return this.deleteItemWithRoleCheck(itemId, uploaderId, false);
  }

  static async deleteItemWithRoleCheck(itemId: string, uploaderId: string, isAdmin: boolean) {
    const existing = await prisma.galleryItem.findUnique({
      where: { id: itemId },
    });

    if (!existing) {
      throw new Error('NOT_FOUND');
    }

    if (!isAdmin && existing.uploaderId !== uploaderId) {
      throw new Error('FORBIDDEN');
    }

    return prisma.galleryItem.delete({
      where: { id: itemId },
    });
  }
}

export class ChatAnalyticsService {
  static async getOrCreateSession(sessionId: string, userId?: string) {
    return prisma.chatSession.upsert({
      where: { sessionId },
      update: { userId: userId || undefined },
      create: {
        sessionId,
        userId: userId || null,
      },
    });
  }

  static async recordMessage(chatSessionId: string, role: string, content: string, sources?: string) {
    return prisma.chatMessage.create({
      data: {
        chatSessionId,
        role,
        content,
        sources: sources || null,
      },
    });
  }

  static async getAnalyticsSummary() {
    const totalSessions = await prisma.chatSession.count();
    const totalMessages = await prisma.chatMessage.count();
    const recentSessions = await prisma.chatSession.findMany({
      take: 20,
      orderBy: { updatedAt: 'desc' },
      include: {
        user: { select: { username: true, role: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    return {
      totalSessions,
      totalMessages,
      recentSessions,
    };
  }
}
