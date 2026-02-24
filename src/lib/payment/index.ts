import { IPaymentProvider } from './types';
import { MockPaymentProvider } from './mock';
import { TossPaymentProvider } from './toss';

export type { PaymentRequest, PaymentResult, IPaymentProvider } from './types';

export function getPaymentProvider(): IPaymentProvider {
    const provider = process.env.PAYMENT_PROVIDER ?? 'mock';

    switch (provider) {
        case 'toss':
            return new TossPaymentProvider();
        case 'mock':
        default:
            return new MockPaymentProvider();
    }
}
