import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderDto } from './dto/order.dto';
import * as process from 'node:process';
import { PayPalService } from '../paypal/paypal.service';

import { Client, Environment, LogLevel } from '@paypal/paypal-server-sdk';
import axios from 'axios';

const client = new Client({
	clientCredentialsAuthCredentials: {
		oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
		oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
	},
	timeout: 0,
	environment: Environment.Sandbox,
	logging: {
		logLevel: LogLevel.Info,
		logRequest: { logBody: true },
		logResponse: { logHeaders: true }
	}
});

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService, private paypalService: PayPalService) {
	}


	async createPayment(dto: OrderDto, userId: string) {
		const orderItems = dto.items.map(item => ({
			quantity: item.quantity,
			price: item.price,
			availabilityStart: new Date(),
			availabilityEnd: new Date(),
			discountPercentage: 0,
			user: { connect: { id: userId } },
			surpriseBag: { connect: { id: item.surpriseBagId } },
			farm: { connect: { id: item.farmId } }
		}));

		const total = dto.items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		);
		const farmId = dto.items[0].farmId;
		const order = await this.prisma.order.create({
			data: {
				status: dto.status ?? 'PENDING',
				items: { create: orderItems },
				total,
				user: { connect: { id: userId } },
				farm: { connect: { id: farmId } }
			}
		});
		const accessToken = await this.paypalService.getAccessToken();

		try {
			const response = await axios.post(
				'https://api-m.sandbox.paypal.com/v2/checkout/orders',
				{
					intent: 'CAPTURE',
					purchase_units: [
						{
							amount: {
								currency_code: 'USD',
								value: total.toFixed(2)
							},
							description: `Order #${order.id} in FarmStock`
						}
					],
					application_context: {
						return_url: `${process.env.CLIENT_URL}/thanks`,
						cancel_url: `${process.env.CLIENT_URL}/cancel`,
						brand_name: 'FarmStock',
						landing_page: 'LOGIN',
						user_action: 'PAY_NOW'
					}
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json'
					}
				}
			);

			return response.data;
		} catch (error) {
			console.error('PayPal API Error:', error.response?.data || error.message);
			throw new InternalServerErrorException('Failed to create PayPal order');
		}

	}
}

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { Client, Environment, LogLevel,  } from '@paypal/paypal-server-sdk';
// import { PayPalHttpClient, SandboxEnvironment, orders } from '@paypal/checkout-server-sdk';
// import { OrderDto } from './dto/order.dto';
// import * as process from 'node:process';
//
// const client = new Client({
// 	clientCredentialsAuthCredentials: {
// 		oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
// 		oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
// 	},
// 	timeout: 0,
// 	environment: Environment.Sandbox,
// 	logging: {
// 		logLevel: LogLevel.Info,
// 		logRequest: { logBody: true },
// 		logResponse: { logHeaders: true }
// 	}
// });
//
// @Injectable()
// export class OrderService {
//
// 	constructor(private prisma: PrismaService) {
// 	}
//
// 	async createPayment(dto: OrderDto, userId: string) {
// 		const orderItems = dto.items.map(item => ({
// 			quantity: item.quantity,
// 			price: item.price,
// 			surpriseBagId: { connect: { id: item.surpriseBagId } },
// 			farmId: { connect: { id: item.farmId } }
//
// 		}));
// 		const total = dto.items.reduce((acc, item) => {
// 			return acc + item.price * item.quantity;
// 		}, 0);
//
// 		const order = await this.prisma.order.create({
// 			data: {
// 				status: dto.status,
// 				items: {
// 					create: orderItems
// 				},
// 				total,
// 				user: {
// 					connect: {
// 						id: userId
// 					}
// 				}
// 			}
// 		});
// 		const request = new orders.OrdersCreateRequest();
// 		request.requestBody({
// 			intent: 'CAPTURE',
// 			purchase_units: [
// 				{
// 					amount: {
// 						currency_code: 'USD',
// 						value: total.toFixed(2),
// 					},
// 					description: `Payment for order in FarmStock. Id payment: #${order.id}`
// 				}
// 			],
// 			application_context: {
// 				return_url: `${process.env.CLIENT_URL}/thanks`,
// 				cancel_url: `${process.env.CLIENT_URL}/cancel`,
// 			}
// 		});
//
// 		const response = await client.execute(request);
// 		return response.result;
//
// 		// const payment = await client.createPayment({
// 		// 	amount: {
// 		// 		value: total.toFixed(2),
// 		// 		currency: 'USD'
// 		// 	},
// 		// 	payment_method_data: {
// 		// 		type: 'bank_card'
// 		// 	},
// 		// 	confirmation: {
// 		// 		type: 'redirect',
// 		// 		return_url: `${process.env.CLIENT_URL}/thanks`
// 		// 	},
// 		// 	description: `Payment for order in FarmStock. Id payment: #${order.id}`
// 		// });
// 		// return payment;
// 	}
//
//
// }
