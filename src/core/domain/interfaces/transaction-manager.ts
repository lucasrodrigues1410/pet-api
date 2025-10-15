export abstract class TransactionManager {
  abstract executeInTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
}