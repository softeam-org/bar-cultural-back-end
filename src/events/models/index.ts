import { Prisma } from '@prisma/client';

export const selectEvent: Prisma.EventSelect = {
  id: true,
  name: true,
  description: true,
  created_at: true,
  updated_at: true,
};
