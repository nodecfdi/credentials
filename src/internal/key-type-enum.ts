/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
export enum KeyType {
  RSA = 'RSA',
  DSA = 'DSA',
  ECDSA = 'ECDSA',
}

export class KeyTypeEnum {
  private readonly type: string;

  constructor(type: string) {
    if (!(type in KeyType)) {
      throw new Error('Index Not Found');
    }

    this.type = type;
  }

  public isRSA(): boolean {
    return this.type === KeyType.RSA;
  }

  /* istanbul ignore next */
  public isDSA(): boolean {
    return this.type === KeyType.DSA;
  }

  /* istanbul ignore next */
  public isECDSA(): boolean {
    return this.type === KeyType.ECDSA;
  }

  public value(): string {
    return this.type;
  }
}
