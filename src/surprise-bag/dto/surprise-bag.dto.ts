import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

	@IsNumber({},{
		message: 'Price must be a number'
	})
	@IsNotEmpty({
		message: 'Price cannot be empty'
	})
	price: number;

}