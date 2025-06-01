import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { hash, verify } from 'argon2';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OAuthRegisterDto } from '../auth/dto/oauthregister.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {
	}

	async getById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				farm: true
			}
		});
		return user;
	}

	async getByEmail(email: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });
		return user;
	}

	async create(dto: RegisterDto) {
		return this.prisma.user.create({
			data: {
				firstName: dto.firstName,
				lastName: dto.lastName,
				email: dto.email,
				phoneNumber: dto.phoneNumber,
				password: await hash(dto.password),
				roles: ['CUSTOMER']

			}
		});
	}

	async update(id: string, dto: UpdateUserDto) {
		const user = await this.getById(id);
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}


		if (dto.email) {
			const existUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
			if (existUser && existUser.id !== id) {
				throw new BadRequestException(`Email ${dto.email} is already in use`);
			}
		}


		const updateData: Partial<User> = {
			firstName: dto.firstName,
			lastName: dto.lastName,
			email: dto.email,
			phoneNumber: dto.phoneNumber,
		};


		if (dto.currentPassword && dto.newPassword) {
			const isMatch = await verify(user.password || '', dto.currentPassword);
			if (!isMatch) {
				throw new BadRequestException('Current password is incorrect');
			}

			if (dto.currentPassword === dto.newPassword) {
				throw new BadRequestException('New password must be different from the current one');
			}


			updateData.password = await hash(dto.newPassword, );
		}

		return this.prisma.user.update({
			where: { id },
			data: updateData,
		});
	}

	async delete(id: string) {
		const deletedUser = await this.prisma.user.delete({
			where: { id }
		});
		return { message: 'User deleted', deletedUser };
	}

	async createWithOAuth(dto: OAuthRegisterDto) {
		return this.prisma.user.create({
			data: {
				email: dto.email,
				firstName: dto.firstName,
				lastName: dto.lastName,
				password: null,
				oauthProvider: dto.oauthProvider,
				roles: ['CUSTOMER']
			}
		});
	}

	async becomeFarmer(userId: string) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');
		if (user.roles.includes('FARMER')) {
			throw new BadRequestException('User is already a farmer');
		}

		return this.prisma.user.update({
			where: { id: userId }, data: {
				roles: {
					push: 'FARMER'
				}
			}
		});
	}
}

