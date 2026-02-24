import { IPaymentProvider, PaymentRequest, PaymentResult } from './types';

export class MockPaymentProvider implements IPaymentProvider {
    async requestPayment(req: PaymentRequest): Promise<PaymentResult> {
        // Mock: 즉시 결제 생성 (pending 상태)
        const externalOrderId = `mock_${req.orderId}_${Date.now()}`;
        return {
            success: true,
            externalOrderId,
            provider: 'mock',
        };
    }

    async confirmPayment(externalOrderId: string): Promise<PaymentResult> {
        // Mock: 즉시 성공 처리
        return {
            success: true,
            paymentId: `mock_pay_${Date.now()}`,
            externalOrderId,
            provider: 'mock',
        };
    }
}
