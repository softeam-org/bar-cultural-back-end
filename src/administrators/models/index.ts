import { Prisma } from '@prisma/client';

export const selectAdmin: Prisma.AdministratorsSelect = {
  created_at: true,
  email: true,
  id: true,
  name: true,
  password: false,
  updated_at: true,
};
