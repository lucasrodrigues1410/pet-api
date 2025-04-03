export abstract class UnitOfWork {
  abstract transaction<T>(action: (tx: any) => Promise<T>): Promise<T>;
}