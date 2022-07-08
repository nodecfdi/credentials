import { Mixin } from 'ts-mixer';
import { DataRecordTrait } from './data-record-trait';
import { KeyType, KeyTypeEnum } from './key-type-enum';

class Key extends Mixin(DataRecordTrait) {
    private typeKey?: KeyTypeEnum;

    constructor(dataRecord: Record<string, unknown>) {
        super();
        this.dataRecord = dataRecord;
    }

    public parsed(): Record<string, unknown> {
        return this.dataRecord;
    }

    public publicKeyContents(): string {
        return this.extractString('key');
    }

    public numberOfBits(): number {
        return this.extractInteger('bits');
    }

    public get type(): KeyTypeEnum {
        if (!this.typeKey) {
            this.typeKey = new KeyTypeEnum(this.extractString('type') || KeyType.RSA);
        }

        return this.typeKey;
    }

    public typeData(): Record<string, unknown> {
        return this.extractObject(this.type.value());
    }

    public isType(type: string): boolean {
        return this.type.value() === type;
    }
}

export { Key };
