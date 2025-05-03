import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	firstName?:string;

	@IsOptional()
	@IsString()
	lastName?:string;

	@IsOptional()
	@IsPhoneNumber()
	phoneNumber?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@MinLength(6)
	password?: string;


}