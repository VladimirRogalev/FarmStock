import { IsArray, IsEmail, IsOptional, IsString, IsUrl, ValidateIf, IsNumber } from 'class-validator';

export class CreateFarmDto {
	@IsString()
	title: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	address?: string;

	@IsOptional()
	@IsNumber()
	latitude?: number;

	@IsOptional()
	@IsNumber()
	longitude?: number;

	@IsOptional()
	@IsString({ each: true })
	tags?: string[];

	@IsOptional()
	@IsString()
	coverImage?: string;

	@ValidateIf(o => o.contactEmail !== '')
	@IsOptional()
	@IsEmail()
	contactEmail?: string;

	@IsOptional()
	@IsString()
	contactPhone?: string;

	@ValidateIf(o => o.website !== '')
	@IsOptional()
	@IsUrl()
	website?: string;
}