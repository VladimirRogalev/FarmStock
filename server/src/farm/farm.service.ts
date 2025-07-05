import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFarmDto } from './dto/CreateFarmDto';
import { UpdateFarmDto } from './dto/UpdateFarmDto';

@Injectable()
export class FarmService {
	constructor(private prisma: PrismaService) {
	}

	async getByOwner(userId: string) {
		const farm = await this.prisma.farm.findFirst({
			where: { ownerId: userId }
		});
		if (!farm) throw new NotFoundException('Farm not found');
		return farm;
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
			const data: any = {
				title: dto.title,
				description: dto.description,
				tags: dto.tags,
				coverImage: dto.coverImage,
				contactEmail: dto.contactEmail,
				contactPhone: dto.contactPhone,
				website: dto.website,
			};
			if (dto.country) data.country = dto.country;
			if (dto.city) data.city = dto.city;
			if (dto.street) data.street = dto.street;
			if (dto.apartment) data.apartment = dto.apartment;
			if (dto.latitude) data.latitude = dto.latitude;
			if (dto.longitude) data.longitude = dto.longitude;
			return this.prisma.farm.create({
				data: {
					...data,
					ownerId: userId
				}
			});
		} else {
			throw new BadRequestException('Only farmers can create farms');
		}
	}

	async update(farmId: string, userId: string, dto: UpdateFarmDto) {
		await this.getById(farmId, userId);

		const updateData: any = {};
		if (dto.title) updateData.title = dto.title;
		if (dto.description) updateData.description = dto.description;
		if (dto.tags) updateData.tags = dto.tags;
		if (dto.coverImage) updateData.coverImage = dto.coverImage;
		if (dto.contactEmail) updateData.contactEmail = dto.contactEmail;
		if (dto.contactPhone) updateData.contactPhone = dto.contactPhone;
		if (dto.website) updateData.website = dto.website;
		if (dto.country) updateData.country = dto.country;
		if (dto.city) updateData.city = dto.city;
		if (dto.street) updateData.street = dto.street;
		if (dto.apartment) updateData.apartment = dto.apartment;
		if (dto.latitude) updateData.latitude = dto.latitude;
		if (dto.longitude) updateData.longitude = dto.longitude;

		return this.prisma.farm.update({
			where: { id: farmId },
			data: updateData
		});
	}

	async delete(farmId: string, userId: string) {
		await this.getById(farmId, userId);
		return this.prisma.farm.delete({
			where: { id: farmId }
		});
	}
}
