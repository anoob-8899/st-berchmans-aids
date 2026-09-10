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
