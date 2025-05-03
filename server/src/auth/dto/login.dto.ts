import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {

	@IsString({ message: 'Email is required' })
	@IsEmail()
	email: string;

	@MinLength(6)
	@IsString({ message: 'Password is required' })
	password: string;
}