import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getById(id);
	}

	@Auth()
	@Put('profile')
	async updateProfile(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(id, dto);
	}

	@Auth()
	@Delete('profile')
	async deleteProfile(
		@CurrentUser('id') id: string,
	) {
		return this.userService.delete(id);
	}


	@Auth()
	@Put('become-farmer')
	async becomeFarmer(@CurrentUser('id') userId: string) {
		return this.userService.becomeFarmer(userId);
	}

}

