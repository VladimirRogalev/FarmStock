import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { SurpriseBagService } from './surprise-bag.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { SurpriseBagDto } from './dto/surprise-bag.dto';
import { CurrentUser } from '../user/decorators/user.decorator';

@Controller('surprise-bags')
export class SurpriseBagController {
	constructor(private readonly surpriseBagService: SurpriseBagService) {
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.surpriseBagService.getAll(searchTerm);
	}

	@Auth()
	@Get('by-farm/:farmId')
	async getByFarmerId(@Param('farmId') farmId: string) {
		return this.surpriseBagService.getByFarmerId(farmId);
	}


	@Get('/:id')
	async getById(@Param('id') id: string) {
		return this.surpriseBagService.getById(id);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(@CurrentUser('id') userId: string,
				 @Body() dto: SurpriseBagDto
	) {
		return this.surpriseBagService.create(userId, dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: SurpriseBagDto, @CurrentUser('id') userId: string
	) {
		return this.surpriseBagService.update(id, dto, userId);
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async delete(
		@Param('id') id: string,  @CurrentUser('id') userId: string
	) {
		return this.surpriseBagService.delete(id, userId);
	}
}
