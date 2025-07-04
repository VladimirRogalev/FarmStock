import { z } from 'zod';

export const farmCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number({ invalid_type_error: 'Enter a number' }).optional(),
  longitude: z.number({ invalid_type_error: 'Enter a number' }).optional(),
  tags: z.string().optional(),
  coverImage: z.string().optional(),
  contactEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  website: z.string().url('Enter a valid URL (e.g., https://example.com)').optional().or(z.literal('')),
});

export const farmEditSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number({ invalid_type_error: 'Enter a number' }).optional(),
  longitude: z.number({ invalid_type_error: 'Enter a number' }).optional(),
  tags: z.string().optional(),
  coverImage: z.string().optional(),
  contactEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  website: z.string().url('Enter a valid URL (e.g., https://example.com)').optional().or(z.literal('')),
});

export type FarmCreateSchema = z.infer<typeof farmCreateSchema>;
export type FarmEditSchema = z.infer<typeof farmEditSchema>; 