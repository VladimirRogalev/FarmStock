import {
	CheckoutPaymentIntent,
	Client,
	Environment,
	LogLevel,
	OrderApplicationContextLandingPage,
	OrderApplicationContextUserAction,
	OrdersController
} from '@paypal/paypal-server-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PayPalService {
	private client: Client;
	private ordersController: OrdersController;

	constructor() {
		this.client = new Client({
			clientCredentialsAuthCredentials: {
				oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
				oAuthClientSecret: process.env.PAYPAL_SECRET_KEY!
			},
			environment: Environment.Sandbox,
			timeout: 0,
			logging: {
				logLevel: LogLevel.Info,
				logRequest: { logBody: true },
				logResponse: { logHeaders: true }
			}
		});

		this.ordersController = new OrdersController(this.client);
	}

	async createOrder(total: number, invoiceId: string) {
		const response = await this.ordersController.createOrder({
			body: {
				intent: CheckoutPaymentIntent.Capture,
				purchaseUnits: [
					{
						amount: {
							currencyCode: 'USD',
							value: total.toFixed(2)
						},
						invoiceId,
						description: `Order #${invoiceId} in FarmStock`
					}
				],
				applicationContext: {
					returnUrl: `${process.env.CLIENT_URL}/orders/thanks`,
					cancelUrl: `${process.env.CLIENT_URL}/cancel`,
					brandName: 'FarmStock',
					landingPage: OrderApplicationContextLandingPage.Login,
					userAction: OrderApplicationContextUserAction.PayNow
				}
			}
		});

		return JSON.parse(<string>response.body);
	}

	async captureOrder(orderId: string) {
		const response = await this.ordersController.captureOrder({
			id: orderId,
			prefer: 'return=representation'
		});

		return JSON.parse(<string>response.body);
	}
}