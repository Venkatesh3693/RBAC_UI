
import { mockUsers, mockRoles } from './mockApi';

export const getUsers = () => {
  return Promise.resolve({ data: mockUsers });
};

export const getRoles = () => {
  return Promise.resolve({ data: mockRoles });
};
