import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { FarmService } from './farm.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CreateFarmDto } from './dto/CreateFarmDto';
import { UpdateFarmDto } from './dto/UpdateFarmDto';

@Controller('farm')
export class FarmController {
	constructor(private readonly farmServices: FarmService) {
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(
		@CurrentUser('id') userId: string,
		@Body() dto: CreateFarmDto
	) {
		return this.farmServices.create(userId, dto);
	}

	@Auth()
	@Get(':id')
	async getById(@Param('id') farmId: string, @CurrentUser('id') userId: string) {
		return this.farmServices.getById(farmId, userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(":id")
	async update(
		@Param('id') farmId: string,
		@CurrentUser('id') userId: string,
		@Body() dto: UpdateFarmDto
	) {
		return this.farmServices.update(farmId, userId, dto);
	}

	@HttpCode(200)
	@Auth()
	@Delete(":id")
	async delete(
		@Param('id') farmId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.farmServices.delete(farmId, userId);
	}

}
