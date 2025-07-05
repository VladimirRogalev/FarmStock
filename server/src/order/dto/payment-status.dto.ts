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

