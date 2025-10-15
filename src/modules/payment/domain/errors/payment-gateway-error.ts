export class PaymentGatewayError extends Error {
  constructor(message = "Payment gateway failed.") {
    super(message);
  }
}