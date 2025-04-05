
export class PaymentWebhookReceivedEvent {
  public static readonly EVENT_NAME = 'payment.webhook.received';

  constructor(
    public readonly gateway: string,
    public readonly gatewayPaymentId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: string,
    public readonly paidAt: Date | null,
    public readonly metadata: Record<string, any>,
    public readonly appointmentIntentId: string | null,
    public readonly webhookEventType: string,
  ) {}
}