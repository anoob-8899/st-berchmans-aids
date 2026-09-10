import fs from 'fs';
import path from 'path';
import { Student, CollegeWing } from './types';
import { DEFAULT_STUDENTS } from './defaultData';

export { DEFAULT_STUDENTS };

function getDataDirPath(): string {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getStudentsFilePath(): string {
  return path.join(getDataDirPath(), 'students.json');
}

function getLoginsFilePath(): string {
  return path.join(getDataDirPath(), 'managed_logins.json');
}

export function readStudents(): Student[] {
  try {
    const filePath = getStudentsFilePath();
    let students: Student[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf-8');
        students = JSON.parse(data);
      } catch (e) {
        students = [];
      }
    }

    if (!Array.isArray(students)) {
      students = [];
    }

    // Populate default students if file is empty
    if (students.length === 0 && DEFAULT_STUDENTS.length > 0) {
      students = [...DEFAULT_STUDENTS];
    }

    // Sync registered student accounts from managed_logins.json
    const loginsPath = getLoginsFilePath();
    if (fs.existsSync(loginsPath)) {
      try {
        const loginsData = fs.readFileSync(loginsPath, 'utf-8');
        const users = JSON.parse(loginsData);
        if (Array.isArray(users)) {
          let hasNewOrUpdated = false;
          for (const u of users) {
            if (u.role === 'student') {
              const existingIdx = students.findIndex(s => 
                s.id === u.id || 
                (s.email && u.email && s.email.toLowerCase() === u.email.toLowerCase()) ||
                (s.name && u.name && s.name.toLowerCase() === u.name.toLowerCase())
              );

              const studentProfile: Student = {
                id: u.id || `stu-${Date.now()}`,
                name: u.name,
                rollNo: u.identifier || '260101',
                batch: u.batch || 'B.Sc. AI & DS (2026 - 2030)',
                bloodGroup: u.bloodGroup || 'O+ve',
                email: u.email,
                photo: u.photo || '/images/sb college logo.jpg',
                skills: u.skills && u.skills.length > 0 ? u.skills : ['Python', 'Data Science', 'Machine Learning'],
                wings: (u.wings && u.wings.length > 0 ? u.wings : ['tech_team']) as CollegeWing[],
                bio: u.bio || 'Student in Department of AI & Data Science.',
                approvalStatus: u.approvalStatus || 'approved',
                linkedIn: u.linkedIn,
                portfolioUrl: u.portfolioUrl,
              };

              if (existingIdx >= 0) {
                const current = students[existingIdx];
                const updatedObj: Student = {
                  ...current,
                  name: u.name || current.name,
                  email: u.email || current.email,
                  photo: u.photo || current.photo,
                  bio: u.bio || current.bio,
                  skills: (u.skills && u.skills.length > 0) ? u.skills : current.skills,
                  wings: (u.wings && u.wings.length > 0) ? u.wings : current.wings,
                  bloodGroup: u.bloodGroup || current.bloodGroup,
                  linkedIn: u.linkedIn || current.linkedIn,
                  portfolioUrl: u.portfolioUrl || current.portfolioUrl,
                };
                if (JSON.stringify(current) !== JSON.stringify(updatedObj)) {
                  students[existingIdx] = updatedObj;
                  hasNewOrUpdated = true;
                }
              } else {
                students.push(studentProfile);
                hasNewOrUpdated = true;
              }
            }
          }
          if (hasNewOrUpdated || !fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(students, null, 2), 'utf-8');
          }
        }
      } catch (e) {
        console.error('Error syncing from managed_logins.json:', e);
      }
    } else {
      if (!fs.existsSync(filePath) && students.length > 0) {
        fs.writeFileSync(filePath, JSON.stringify(students, null, 2), 'utf-8');
      }
    }

    return students;
  } catch (error) {
    console.error('Error reading students file:', error);
    return DEFAULT_STUDENTS;
  }
}

export function writeStudents(students: Student[]): void {
  try {
    const filePath = getStudentsFilePath();
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing students file:', error);
  }
}

export function saveOrUpdateStudent(student: Student): Student[] {
  const students = readStudents();
  const index = students.findIndex(s => 
    s.id === student.id || 
    (s.email && student.email && s.email.toLowerCase() === student.email.toLowerCase()) ||
    (s.name && student.name && s.name.toLowerCase() === student.name.toLowerCase())
  );
  
  if (index >= 0) {
    students[index] = { ...students[index], ...student };
  } else {
    students.unshift(student);
  }
  
  writeStudents(students);
  return students;
}

export function getStudentById(id: string): Student | undefined {
  const students = readStudents();
  const lowerId = id.toLowerCase();
  return students.find(s => 
    s.id === id || 
    s.rollNo === id || 
    s.name.toLowerCase() === lowerId ||
    (s.email && s.email.toLowerCase() === lowerId)
  );
}

export function deleteStudent(id: string): Student[] {
  try {
    const filePath = getStudentsFilePath();
    let students: Student[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf-8');
        students = JSON.parse(data);
      } catch (e) {}
    }
    const lowerId = id.toLowerCase();
    const filtered = students.filter(s => 
      s.id !== id && 
      s.rollNo !== id && 
      s.name.toLowerCase() !== lowerId &&
      (!s.email || s.email.toLowerCase() !== lowerId)
    );
    writeStudents(filtered);
    return filtered;
  } catch (error) {
    console.error('Error deleting student:', error);
    return [];
  }
}


