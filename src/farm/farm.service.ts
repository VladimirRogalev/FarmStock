import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFarmDto } from './dto/CreateFarmDto';
import { UpdateFarmDto } from './dto/UpdateFarmDto';

@Injectable()
export class FarmService {
	constructor(private prisma: PrismaService) {
	}

	async getById(farmId: string, userId?: string) {
		const farm = await this.prisma.farm.findUnique({
			where: {
				id: farmId
			}
		});
		if (!farm) throw new NotFoundException('Farm not found');
		if (userId && farm.ownerId !== userId) throw new ForbiddenException('You are not the owner of this farm');


		return farm;
	}

	async create(userId: string, dto: CreateFarmDto) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { farm: true }
		});

		if (!user) throw new BadRequestException('User not found');
		if (user.farm) throw new BadRequestException('User already has a farm');
		if (user.roles.includes('FARMER')) {
			return this.prisma.farm.create({
				data: {
					title: dto.title,
					description: dto.description,
					address: dto.address,
					coordinates: dto.coordinates,
					tags: dto.tags || [],
					coverImage: dto.coverImage,
					contactEmail: dto.contactEmail,
					contactPhone: dto.contactPhone,
					website: dto.website,
					ownerId: userId
				}
			});
		} else {
			throw new BadRequestException('Only farmers can create farms');
		}
	}

	async update(farmId: string, userId: string, dto: UpdateFarmDto) {
		await this.getById(farmId, userId);

		return this.prisma.farm.update({
			where: { id: farmId },
			data: {
				title: dto.title,
				description: dto.description,
				address: dto.address,
				coordinates: dto.coordinates,
				tags: dto.tags,
				coverImage: dto.coverImage,
				contactEmail: dto.contactEmail,
				contactPhone: dto.contactPhone,
				website: dto.website
			}
		});
	}

	async delete(farmId: string, userId: string) {
		await this.getById(farmId, userId);

		return this.prisma.farm.delete({
			where: { id: farmId }
		});
	}

}
