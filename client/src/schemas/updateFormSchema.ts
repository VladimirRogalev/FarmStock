import { z } from 'zod';

export const updateFormSchema = z
	.object({
		firstName: z.string().min(2, 'First name is required'),
		lastName: z.string().min(2, 'Last name is required'),
		email: z.string().email('Invalid email address'),
		phoneNumber: z.string().min(6, 'Phone number is too short').optional(),
		currentPassword: z.string().optional(),
		newPassword: z.string().optional(),
		confirmNewPassword: z.string().optional(),
		country: z.string().min(2, 'Country is required').optional(),
		city: z.string().min(2, 'City is required').optional(),
		street: z.string().min(2, 'Street is required').optional(),
		apartment: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
	})
	.superRefine((data, ctx) => {
		const intendsToChangePassword =
			!!data.currentPassword?.trim() ||
			!!data.newPassword?.trim() ||
			!!data.confirmNewPassword?.trim();

		if (intendsToChangePassword) {
			if (data.currentPassword === undefined || data.currentPassword.trim() === '') {
				ctx.addIssue({
					path: ['currentPassword'],
					code: z.ZodIssueCode.custom,
					message: 'Current password is required to change password',
				});
			}

			if (data.newPassword === undefined || data.newPassword.trim() === '') {
				ctx.addIssue({
					path: ['newPassword'],
					code: z.ZodIssueCode.custom,
					message: 'New password is required',
				});
			} else if (data.newPassword.length < 6) {
				ctx.addIssue({
					path: ['newPassword'],
					code: z.ZodIssueCode.too_small,
					minimum: 6,
					type: 'string',
					inclusive: true,
					message: 'New password must be at least 6 characters',
				});
			}

			if (data.newPassword !== undefined && data.newPassword.trim() !== '') {
				if (data.confirmNewPassword === undefined || data.confirmNewPassword.trim() === '') {
					ctx.addIssue({
						path: ['confirmNewPassword'],
						code: z.ZodIssueCode.custom,
						message: 'Please confirm your new password',
					});
				} else if (data.newPassword !== data.confirmNewPassword) {
					ctx.addIssue({
						path: ['confirmNewPassword'],
						code: z.ZodIssueCode.custom,
						message: 'Passwords do not match',
					});
				}
			}

		}
	});

export type UpdateFormSchemaData  = z.infer<typeof updateFormSchema>;