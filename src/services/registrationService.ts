import { Registration } from '@/models/club';

const STORAGE_KEY = 'registrations';

export const getRegistrations = (): Registration[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRegistrations = (data: Registration[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updateRegistration = (updated: Registration) => {
  const list = getRegistrations();
  const newList = list.map(item => item.id === updated.id ? updated : item);
  saveRegistrations(newList);
};

export const deleteRegistration = (id: number) => {
  const list = getRegistrations().filter(item => item.id !== id);
  saveRegistrations(list);
};
