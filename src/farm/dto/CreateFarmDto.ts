import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateFarmDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsNotEmpty()
	address: string;

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