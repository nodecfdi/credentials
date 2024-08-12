export const SatType = {
  FIEL: 'FIEL',
  CSD: 'CSD',
} as const;

export class SatTypeEnum {
  private readonly type: string;

  public constructor(type: string) {
    /* istanbul ignore if -- @preserve */
    if (!(type in SatType)) {
      throw new Error('Index Not Found');
    }

    this.type = type;
  }

  public isFiel(): boolean {
    return this.type === SatType.FIEL;
  }

  public isCsd(): boolean {
    return this.type === SatType.CSD;
  }
}
