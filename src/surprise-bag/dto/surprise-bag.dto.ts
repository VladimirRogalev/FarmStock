import {
	ArrayMinSize,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString
} from 'class-validator';
import { EnumSurpriseBagCategory } from '@prisma/client';

export class SurpriseBagDto {
	@IsString({
		message: 'Title is required'
	})
	@IsNotEmpty({
		message: 'Title cannot be empty'
	})
	title: string;

	@IsString({
		message: 'Description is required'
	})
	@IsNotEmpty({
		message: 'Description cannot be empty'
	})
	description: string;

	@IsNumber({}, {
		message: 'Price must be a number'
	})
	@IsNotEmpty({
		message: 'Price cannot be empty'
	})
	price: number;

	@IsString({
		message: 'Please upload an image',
		each: true
	})
	@ArrayMinSize(1, { message: 'There must be at least one picture' })
	@IsNotEmpty({
		each: true,
		message: 'The path to the image cannot be empty'
	})
	images: string[];
	@IsNotEmpty({ message: 'Expiration date is required' })
	@IsDateString({}, { message: 'Expiration date must be a valid ISO date string' })
	expiresAt: string;
	@IsEnum(EnumSurpriseBagCategory, {
		message: 'Category must be one of the predefined categories'
	})
	category: EnumSurpriseBagCategory;

	@IsNumber({}, { message: 'Quantity must be a number' })
	@IsPositive({ message: 'Quantity must be greater than zero' })
	quantity: number;

}