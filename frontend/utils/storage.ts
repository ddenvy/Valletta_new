import { User } from '@/types/user';

const USER_KEY = 'user_data';

export const storage = {
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  updateUser: (userData: Partial<User>): User => {
    const currentUser = storage.getUser();
    if (!currentUser) throw new Error('No user found');
    
    const updatedUser = { ...currentUser, ...userData };
    storage.setUser(updatedUser);
    return updatedUser;
  }
};
