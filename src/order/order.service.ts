import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderDto } from './dto/order.dto';
import { PayPalService } from '../paypal/paypal.service';

@Injectable()
export class OrderService {
	constructor(
		private prisma: PrismaService,
		private paypalService: PayPalService,
	) {}

	async createPayment(dto: OrderDto, userId: string) {
		const orderItems = dto.items.map((item) => ({
			quantity: item.quantity,
			price: item.price,
			availabilityStart: new Date(),
			availabilityEnd: new Date(),
			discountPercentage: 0,
			user: { connect: { id: userId } },
			surpriseBag: { connect: { id: item.surpriseBagId } },
			farm: { connect: { id: item.farmId } },
		}));

		const total = dto.items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0,
		);
		const farmId = dto.items[0].farmId;

		const order = await this.prisma.order.create({
			data: {
				status: dto.status ?? 'PENDING',
				items: { create: orderItems },
				total,
				user: { connect: { id: userId } },
				farm: { connect: { id: farmId } },
			},
		});

		try {
			const paypalOrder = await this.paypalService.createOrder(total, order.id);
			return paypalOrder;
		} catch (error) {
			console.error('PayPal SDK Error:', error);
			throw new InternalServerErrorException('Failed to create PayPal order');
		}
	}

	async capturePayment(orderId: string) {
		try {
			const captureResult = await this.paypalService.captureOrder(orderId);

			const capture =
				captureResult?.purchase_units?.[0]?.payments?.captures?.[0];
			const invoiceId = capture?.invoice_id;
			const status = capture?.status;

			if (invoiceId && status === 'COMPLETED') {
				await this.prisma.order.update({
					where: { id: invoiceId },
					data: { status: 'PAID' },
				});

				console.log(`Order ${invoiceId} marked as PAID`);
			} else {
				console.warn(
					` Capture result is not COMPLETED for order ${orderId}`,
				);
				console.warn(captureResult);
			}

			return captureResult;
		} catch (error) {
			console.error('PayPal Capture Error:', error);
			throw new InternalServerErrorException('Failed to capture payment');
		}
	}
}