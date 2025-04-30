import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class OrderDto {
	@IsOptional()
	@IsEnum(EnumOrderStatus, {
		message: 'Status orders need to be'
	})
	status: EnumOrderStatus;
	@IsArray({
		message: 'There are no items in the order'
	})
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items: OrderItemDto[];
}

export class OrderItemDto {
	@IsNumber({}, { message: 'Quantity need to be a number' })
	quantity: number;

	@IsNumber({}, { message: 'Price need to be a number' })
	price: number;

	@IsString({ message: 'Id of surprise bag need to be a string' })
	surpriseBagId: string;

	@IsString({ message: 'Id of farm need to be a string' })
	farmId: string;


}

