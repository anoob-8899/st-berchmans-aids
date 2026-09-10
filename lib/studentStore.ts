import fs from 'fs';
import path from 'path';
import { Student } from './types';
import { DEFAULT_STUDENTS } from './defaultData';

export { DEFAULT_STUDENTS };

function getDataFilePath(): string {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'students.json');
}

export function readStudents(): Student[] {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_STUDENTS, null, 2), 'utf-8');
      return DEFAULT_STUDENTS;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const students: Student[] = JSON.parse(data);
    if (!Array.isArray(students) || students.length === 0) {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_STUDENTS, null, 2), 'utf-8');
      return DEFAULT_STUDENTS;
    }
    return students;
  } catch (error) {
    console.error('Error reading students file:', error);
    return DEFAULT_STUDENTS;
  }
}

export function writeStudents(students: Student[]): void {
  try {
    const filePath = getDataFilePath();
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing students file:', error);
  }
}

export function saveOrUpdateStudent(student: Student): Student[] {
  const students = readStudents();
  const index = students.findIndex(s => s.id === student.id || (s.email && student.email && s.email.toLowerCase() === student.email.toLowerCase()));
  
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
  return students.find(s => s.id === id || s.rollNo === id || s.name.toLowerCase() === id.toLowerCase());
}
