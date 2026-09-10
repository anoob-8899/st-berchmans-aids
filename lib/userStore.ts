import fs from 'fs';
import path from 'path';

export interface ManagedUser {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  identifier: string;
  department: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  tempPassword?: string;
  oneTimePermission?: boolean;
  password?: string;
  photo?: string;
  approvalStatus?: string;
  phone?: string;
  batch?: string;
  admissionYear?: string;
  bio?: string;
  skills?: string[];
  wings?: string[];
}

const DEFAULT_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'admin-main',
    name: 'Chief Administrator',
    username: 'adminaids',
    email: 'adminaids@sbcollege.ac.in',
    role: 'admin',
    identifier: 'Staff: ADM-SYS-01',
    department: 'Artificial Intelligence & Data Science',
    status: 'active',
    lastLogin: 'Active Now',
    photo: '/images/sb college logo.jpg',
    bio: 'Chief System Administrator for the Department of Artificial Intelligence & Data Science, St. Berchmans College.',
  },
  {
    id: 'usr-rahul',
    name: 'Rahul V. Nair',
    username: 'rahul_nair',
    email: 'rahul.nair@student.sbcollege.ac.in',
    role: 'student',
    identifier: 'Roll: 401',
    department: 'Artificial Intelligence & Data Science',
    status: 'active',
    lastLogin: '2 hours ago',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    bio: 'AI & Data Science enthusiast passionate about Malayalam NLP and autonomous computer vision.',
    skills: ['PyTorch', 'Computer Vision', 'Next.js', 'Python'],
    wings: ['tech_team', 'nss'],
  },
  {
    id: 'usr-ananya',
    name: 'Ananya S. Kumar',
    username: 'ananya_kumar',
    email: 'ananya.kumar@student.sbcollege.ac.in',
    role: 'student',
    identifier: 'Roll: 402',
    department: 'Artificial Intelligence & Data Science',
    status: 'active',
    lastLogin: 'Yesterday',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    bio: 'Data Analyst focusing on financial predictive modeling and interactive dashboard visualisations.',
    skills: ['Data Analytics', 'Power BI', 'Scikit-Learn', 'SQL'],
    wings: ['media_team', 'sports'],
  },
  {
    id: 'usr-kevin',
    name: 'Kevin P. Thomas',
    username: 'kevin_thomas',
    email: 'kevin.thomas@student.sbcollege.ac.in',
    role: 'student',
    identifier: 'Roll: 403',
    department: 'Artificial Intelligence & Data Science',
    status: 'active',
    lastLogin: '3 days ago',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Embedded Systems & AI Engineer building smart campus attendance hardware.',
    skills: ['TensorFlow', 'IoT', 'Raspberry Pi', 'Embedded AI'],
    wings: ['tech_team', 'ncc'],
  },
  {
    id: 'usr-devika',
    name: 'Devika R. Menon',
    username: 'devika_menon',
    email: 'devika.menon@student.sbcollege.ac.in',
    role: 'student',
    identifier: 'Roll: 404',
    department: 'Artificial Intelligence & Data Science',
    status: 'active',
    lastLogin: '5 hours ago',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Conversational AI researcher crafting domain-specific RAG chatbots.',
    skills: ['NLP', 'LLMs', 'RAG Pipelines', 'LangChain'],
    wings: ['media_team', 'nss'],
  }
];

function getDataFilePath(): string {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'managed_logins.json');
}

export function readUsers(): ManagedUser[] {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_MANAGED_USERS, null, 2), 'utf-8');
      return DEFAULT_MANAGED_USERS;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const users: ManagedUser[] = JSON.parse(data);

    // Ensure adminaids account is present and active
    const hasAdmin = users.some(u => u.id === 'admin-main' || (u.username && u.username.toLowerCase() === 'adminaids'));
    if (!hasAdmin) {
      users.unshift(DEFAULT_MANAGED_USERS[0]);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
    }
    return users;
  } catch (error) {
    console.error('Error reading users file:', error);
    return DEFAULT_MANAGED_USERS;
  }
}

export function writeUsers(users: ManagedUser[]): void {
  try {
    const filePath = getDataFilePath();
    
    // Always ensure adminaids is active
    const sanitized = users.map(u => {
      if (u.id === 'admin-main' || (u.username && u.username.toLowerCase() === 'adminaids')) {
        return { ...u, status: 'active' as const };
      }
      return u;
    });

    fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
}

export function saveOrUpdateUser(user: ManagedUser): ManagedUser[] {
  const users = readUsers();
  const index = users.findIndex(u => u.id === user.id || (user.username && u.username?.toLowerCase() === user.username.toLowerCase()));
  
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.unshift(user);
  }
  
  writeUsers(users);
  return users;
}

export function deleteUser(id: string): ManagedUser[] {
  const users = readUsers();
  const filtered = users.filter(u => u.id !== id && u.id !== 'admin-main');
  writeUsers(filtered);
  return filtered;
}
