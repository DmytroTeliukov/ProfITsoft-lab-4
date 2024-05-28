export class DishNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DishNotFoundError';
  }
}
