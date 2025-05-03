class AmountPayment {
	value: string;
	currency: string;
}

class ObjectPayment {
	id: string;
	status: string;
	invoice_id: string;
	amount: AmountPayment;
	payment_method: {
		type: string;
		id: string;
		saved: boolean;
		title: string;
		card: object;
	};
	created_at: string;
	expires_at: string;
	description: string;
}

// export class PaymentStatusDto {
// 	event:
// 		| 'PAYMENT.CAPTURE.COMPLETED'
// 		| 'PAYMENT.AUTHORIZATION.CREATED'
// 		| 'PAYMENT.AUTHORIZATION.VOIDED'
// 		| 'PAYMENT.CAPTURE.DECLINED'
// 		| 'PAYMENT.CAPTURE.PENDING'
// 		| 'PAYMENT.CAPTURE.REFUNDED'
// 		| 'PAYMENT.CAPTURE.REVERSED'
// 	type: string;
// 	object: ObjectPayment;
// }