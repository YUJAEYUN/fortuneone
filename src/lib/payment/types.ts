export interface PaymentRequest {
    orderId: string;
    amount: number;
    orderName: string;
    customerName: string;
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    externalOrderId: string;
    provider: 'mock' | 'toss';
    error?: string;
}

export interface IPaymentProvider {
    requestPayment(req: PaymentRequest): Promise<PaymentResult>;
    confirmPayment(externalOrderId: string, paymentKey?: string): Promise<PaymentResult>;
}
