import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PayPalService {
	async getAccessToken(): Promise<string> {
		const clientId = process.env.PAYPAL_CLIENT_ID!;
		const clientSecret = process.env.PAYPAL_SECRET_KEY!;
		const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

		try {
			const response = await axios.post(
				'https://api-m.sandbox.paypal.com/v1/oauth2/token',
				'grant_type=client_credentials',
				{
					headers: {
						Authorization: `Basic ${credentials}`,
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			return response.data.access_token;
		} catch (error) {
			console.error('PayPal token error:', error.response?.data || error.message);
			throw new Error('Failed to get PayPal access token');
		}
	}
}