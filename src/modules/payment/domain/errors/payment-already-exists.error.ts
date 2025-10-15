export class PaymentAlreadyExistsError extends Error {
  constructor() {
    super("A payment already exists for this appointment.");
  }
}