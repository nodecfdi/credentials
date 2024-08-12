import { Mixin } from 'ts-mixer';
import DataArray from '#src/internal/data_array';
import { KeyTypeEnum } from '#src/internal/key_type';

export default class Key extends Mixin(DataArray) {
  private typeKey?: KeyTypeEnum;

  public constructor(dataArray: Record<string, unknown>) {
    super();
    this._dataArray = dataArray;
  }

  public get type(): KeyTypeEnum {
    if (!this.typeKey) {
      this.typeKey = new KeyTypeEnum(this.extractString('type'));
    }

    return this.typeKey;
  }

  public parsed(): Record<string, unknown> {
    return this._dataArray;
  }

  public publicKeyContents(): string {
    return this.extractString('key');
  }

  public numberOfBits(): number {
    return this.extractInteger('bits');
  }

  public typeData(): Record<string, unknown> {
    return this.extractArray(this.type.value());
  }

  public isType(type: string): boolean {
    return this.type.value() === type;
  }
}
