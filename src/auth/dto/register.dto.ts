import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@IsOptional()
	@IsString()
	firstName: string;

	@IsOptional()
	@IsString()
	lastName: string;

	@IsString({ message: 'Email is required' })
	@IsEmail()
	email: string;

	@IsString({ message: 'Phone number is required' })
	@IsPhoneNumber()
	phoneNumber: string;

	@MinLength(6, {
		message: 'The password must contain at least 6 characters'
	})
	@IsString({ message: 'Password is required' })
	password: string;
}