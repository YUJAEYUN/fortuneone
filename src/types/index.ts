export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'fortune_generated'
  | 'failed';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';

export type PaymentProvider = 'mock' | 'toss';

export interface Order {
  id: string;
  created_at: string;
  name: string;
  birth_date: string; // ISO date string
  story?: string | null;
  status: OrderStatus;
  amount: number;
}

export interface Payment {
  id: string;
  created_at: string;
  order_id: string;
  provider: PaymentProvider;
  provider_payment_id?: string | null;
  external_order_id: string;
  amount: number;
  status: PaymentStatus;
  paid_at?: string | null;
  raw_response?: Record<string, unknown> | null;
}

export interface FortuneContent {
  overall_energy: string;    // 오늘의 전체 기운
  interview_energy: string;  // 면접/시험 기운
  closing_message: string;   // 술사의 마지막 말
}

export interface Fortune {
  id: string;
  created_at: string;
  order_id: string;
  content: FortuneContent;
  model: string;
  prompt_hash?: string | null;
}

export interface OrderWithFortune extends Order {
  fortune?: Fortune | null;
}

// Form input
export interface FortuneFormInput {
  name: string;
  birth_date: string;
  story?: string;
}
