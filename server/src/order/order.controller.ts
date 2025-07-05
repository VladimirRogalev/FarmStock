import { Body, Controller, Get, HttpCode, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Response } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import { OrderDto } from './dto/order.dto';
import { CurrentUser } from '../user/decorators/user.decorator';

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('place')
	@Auth()
	async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
		return this.orderService.createPayment(dto, userId);
	}



	@Get('thanks')
	async handleThanks(@Query('token') token: string, @Res() res: Response) {
		try {
			const result = await this.orderService.capturePayment(token);
			return res.status(200).json({
				message: 'Payment completed successfully',
				result,
			});
		} catch (e) {
			return res.status(500).json({
				message: 'Failed to complete payment. Please try again later. ',
			});
		}
	}
}
