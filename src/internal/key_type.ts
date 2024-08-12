export const KeyType = {
  RSA: 'RSA',
  DSA: 'DSA',
  ECDSA: 'ECDSA',
} as const;

export class KeyTypeEnum {
  private readonly type: string;

  public constructor(rawType: string) {
    const type = rawType === '' ? 'RSA' : rawType;

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
