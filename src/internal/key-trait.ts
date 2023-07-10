import { Mixin } from 'ts-mixer';
import { DataArrayTrait } from './data-array-trait.js';
import { KeyType, KeyTypeEnum } from './key-type-enum.js';

export class KeyTrait extends Mixin(DataArrayTrait) {
    private typeKey?: KeyTypeEnum;

    constructor(dataArray: Record<string, unknown>) {
        super();
        this._dataArray = dataArray;
    }

    public get type(): KeyTypeEnum {
        if (!this.typeKey) {
            this.typeKey = new KeyTypeEnum(this.extractString('type') || KeyType.RSA);
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
