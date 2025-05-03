import { ArrayMinSize, IsArray, IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateFarmDto {
	@IsOptional()
	@IsString()
	title: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsOptional()
	@IsString()
	address: string;

	@IsOptional()
	@IsArray()
	@ArrayMinSize(2)
	@IsNumber({}, { each: true })
	coordinates: number[];

	@IsOptional()
	@IsString({ each: true })
	tags?: string[];

	@IsOptional()
	@IsString()
	coverImage?: string;

	@IsOptional()
	@IsEmail()
	contactEmail?: string;

	@IsOptional()
	@IsString()
	contactPhone?: string;

	@IsOptional()
	@IsUrl()
	website?: string;
}