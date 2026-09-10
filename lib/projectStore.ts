import fs from 'fs';
import path from 'path';
import { Project, ProjectComment } from './types';
import { DEFAULT_PROJECTS } from './defaultData';

export { DEFAULT_PROJECTS };

function getDataFilePath(): string {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'projects.json');
}

export function readProjects(): Project[] {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_PROJECTS, null, 2), 'utf-8');
      return DEFAULT_PROJECTS;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const projects: Project[] = JSON.parse(data);
    if (!Array.isArray(projects) || projects.length === 0) {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_PROJECTS, null, 2), 'utf-8');
      return DEFAULT_PROJECTS;
    }
    return projects;
  } catch (error) {
    console.error('Error reading projects file:', error);
    return DEFAULT_PROJECTS;
  }
}

export function writeProjects(projects: Project[]): void {
  try {
    const filePath = getDataFilePath();
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing projects file:', error);
  }
}

export function saveOrUpdateProject(project: Project): Project[] {
  const projects = readProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = { ...projects[index], ...project };
  } else {
    projects.unshift(project);
  }
  
  writeProjects(projects);
  return projects;
}

export function addProjectComment(projectId: string, comment: ProjectComment): Project[] {
  const projects = readProjects();
  const index = projects.findIndex(p => p.id === projectId);
  
  if (index >= 0) {
    const existing = projects[index];
    const comments = existing.comments || [];
    comments.push(comment);
    
    // Recalculate rating
    const total = comments.reduce((sum, c) => sum + c.rating, 0);
    const newRating = Number((total / comments.length).toFixed(1));
    
    projects[index] = {
      ...existing,
      comments,
      rating: newRating,
      ratingCount: comments.length,
    };
    
    writeProjects(projects);
  }
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  const projects = readProjects();
  return projects.find(p => p.id === id);
}
