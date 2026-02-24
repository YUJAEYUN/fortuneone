import { IPaymentProvider, PaymentRequest, PaymentResult } from './types';

// 추후 TossPayments SDK 연동 시 구현
// npm install @tosspayments/tosspayments-sdk
export class TossPaymentProvider implements IPaymentProvider {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async requestPayment(_req: PaymentRequest): Promise<PaymentResult> {
        throw new Error('TossPaymentProvider: not yet implemented. Set PAYMENT_PROVIDER=mock');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async confirmPayment(_externalOrderId: string, _paymentKey?: string): Promise<PaymentResult> {
        throw new Error('TossPaymentProvider: not yet implemented. Set PAYMENT_PROVIDER=mock');
    }
}
