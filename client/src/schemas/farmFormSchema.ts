import { z } from 'zod';

export const farmCreateSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  street: z.string().min(2, 'Street is required'),
  apartment: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  tags: z.string().optional(),
  coverImage: z.string().optional(),
  contactEmail: z.string().email('Invalid email').optional(),
  contactPhone: z.string().optional(),
  website: z.string().optional(),
});

export const farmEditSchema = farmCreateSchema.partial();

export type FarmCreateSchema = z.infer<typeof farmCreateSchema>;
export type FarmEditSchema = z.infer<typeof farmEditSchema>; 