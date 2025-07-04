import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SurpriseBagDto } from './dto/surprise-bag.dto';

@Injectable()
export class SurpriseBagService {
	constructor(private prisma: PrismaService) {
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) {
			return this.getSearchTermFilter(searchTerm);
		}
		const surpriseBags = await this.prisma.surpriseBag.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		});
		return surpriseBags;

	}

	private getSearchTermFilter(searchTerm: string) {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		};
	}

	async getByFarmerId(farmId: string) {
		const surpriseBag = await this.prisma.surpriseBag.findMany({
			where: {
				farmId
			}
		});
		if (!surpriseBag) {
			throw new NotFoundException('Surprise Bag not found');
		}
		return surpriseBag;
	}

	async getById(id: string) {
		const surpriseBag = await this.prisma.surpriseBag.findUnique({
			where: {
				id
			}
		});
		if (!surpriseBag) {
			throw new NotFoundException('Surprise Bag not found');
		}
		return surpriseBag;
	}

	// async getMostPopular(limit = 5) {
	// 	const mostPopularSB = await this.prisma.orderItem.groupBy({
	// 		by: ['surpriseBagId'],
	// 		_count: {
	// 			surpriseBagId: true
	// 		},
	// 		orderBy: {
	// 			_count: {
	// 				surpriseBagId: 'desc'
	// 			}
	// 		},
	// 		take: limit
	// 	});
	// 	const surpriseBagIds = mostPopularSB.map(item => item.surpriseBagId);
	//
	// 	const surpriseBags = await this.prisma.surpriseBag.findMany({
	// 		where: {
	// 			id: { in: surpriseBagIds }
	// 		}
	// 	});
	// 	const surpriseBagsMap = new Map(surpriseBags.map(bag => [bag.id, bag]));
	// 	const sortedBags = surpriseBagIds.map(id => surpriseBagsMap.get(id));
	//
	// 	return sortedBags;
	// }

	// async getSimilar(id:string) {
	// 	const currentSurpriseBag = await this.getById(id)
	// 	if (!currentSurpriseBag) {
	// 		throw new NotFoundException('Current surprise bag not found');
	// 	}
	// 	const surpriseBags = await this.prisma.surpriseBag.findMany({
	// 		where:{
	//
	// 		}
	// 	})
	// }

	async create(userId: string, dto: SurpriseBagDto) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { farm: true }
		});
		if (!user || !user.farm) {
			throw new BadRequestException('User is not a farmer or has no farm');
		}
		return this.prisma.surpriseBag.create({
			data: {
				title: dto.title,
				description: dto.description,
				price: dto.price,
				images: dto.images,
				category: dto.category,
				quantity: dto.quantity,
				expiresAt: new Date(dto.expiresAt),
				address: user.farm.address,
				farmId: user.farm.id
			}
		});
	}

	async update(id: string, dto: Partial<SurpriseBagDto>, userId: string) {
		const bag = await this.prisma.surpriseBag.findUnique({ where: { id } });
		if (!bag) {
			throw new NotFoundException('Surprise bag not found');
		}
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { farm: true }
		});
		if (bag.farmId !== user?.farm?.id) {
			throw new ForbiddenException('You can only update your own surprise bags');
		}

		return this.prisma.surpriseBag.update({
			where: { id },
			data: dto
		});
	}

	async delete(id: string, userId: string) {
		const bag = await this.prisma.surpriseBag.findUnique({
			where: { id }
		});

		if (!bag) throw new NotFoundException('Surprise bag not found');

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { farm: true }
		});

		if (bag.farmId !== user?.farm?.id) {
			throw new ForbiddenException('You can only delete your own surprise bags');
		}

		return this.prisma.surpriseBag.delete({
			where: { id }
		});
	}
}
