import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength, IsNumber } from 'class-validator';

export class UpdateUserDto {
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	phoneNumber?: string;

	@IsOptional()
	@IsString()
	currentPassword?: string;

	@IsOptional()
	@IsString()
	newPassword?: string;

	@IsOptional()
	@IsString()
	country?: string;

	@IsOptional()
	@IsString()
	city?: string;

	@IsOptional()
	@IsString()
	street?: string;

	@IsOptional()
	@IsString()
	apartment?: string;

	@IsOptional()
	@IsNumber()
	latitude?: number;

	@IsOptional()
	@IsNumber()
	longitude?: number;
}