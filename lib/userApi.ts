import { ManagedUser } from './userStore';

export async function fetchManagedUsers(): Promise<ManagedUser[]> {
  try {
    const res = await fetch('/api/users', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sb_managed_logins', JSON.stringify(data.users));
        }
        return data.users;
      }
    }
  } catch (error) {
    console.warn('API fetch failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sb_managed_logins');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
  }
  return [];
}

export async function saveUserAccount(user: ManagedUser): Promise<ManagedUser[]> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sb_managed_logins', JSON.stringify(data.users));
          window.dispatchEvent(new Event('storage'));
        }
        return data.users;
      }
    }
  } catch (error) {
    console.error('Failed to save user to API:', error);
  }

  // Fallback to localStorage update
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sb_managed_logins');
    const users: ManagedUser[] = saved ? JSON.parse(saved) : [];
    const index = users.findIndex(u => u.id === user.id || (user.username && u.username?.toLowerCase() === user.username.toLowerCase()));
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.unshift(user);
    }
    localStorage.setItem('sb_managed_logins', JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
    return users;
  }
  return [];
}

export async function bulkUpdateUsers(users: ManagedUser[]): Promise<ManagedUser[]> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sb_managed_logins', JSON.stringify(data.users));
          window.dispatchEvent(new Event('storage'));
        }
        return data.users;
      }
    }
  } catch (error) {
    console.error('Failed to bulk update users via API:', error);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('sb_managed_logins', JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
  }
  return users;
}

export async function deleteUserAccount(id: string): Promise<ManagedUser[]> {
  try {
    const res = await fetch(`/api/users?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sb_managed_logins', JSON.stringify(data.users));
          window.dispatchEvent(new Event('storage'));
        }
        return data.users;
      }
    }
  } catch (error) {
    console.error('Failed to delete user via API:', error);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sb_managed_logins');
    const users: ManagedUser[] = saved ? JSON.parse(saved) : [];
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('sb_managed_logins', JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
    return filtered;
  }
  return [];
}
