import { z } from 'zod'

export const registerSchema = z
	.object({
		firstName: z.string().min(2, 'First name is required'),
		lastName: z.string().min(2, 'Last name is required'),
		email: z.string().email('Invalid email'),
		phoneNumber: z.string().min(7, 'Phone number is required'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match'
	})

export type RegisterFormData = z.infer<typeof registerSchema>