import { Prisma } from '@prisma/client';

export const selectProduct: Prisma.ProductSelect = {
  id: true,
  name: true,
  description: true,
  value: true,
  created_at: true,
  updated_at: true,
}