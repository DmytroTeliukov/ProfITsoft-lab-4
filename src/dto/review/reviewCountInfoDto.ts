export class ReviewCountInfoDto {
  [key: string]: number;

  constructor(data: Partial<{ [key: string]: number }> = {}) {
    Object.assign(this, data);
  }
}