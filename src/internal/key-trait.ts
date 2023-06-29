import { Subtrait } from '@ddd-ts/traits';
import { DataArrayTrait } from './data-array-trait.js';
import { KeyType, KeyTypeEnum } from './key-type-enum.js';

export const KeyTrait = Subtrait(
    [DataArrayTrait],
    (base) =>
        class extends base {
            private typeKey?: KeyTypeEnum;

            constructor(dataArray: Record<string, unknown>) {
                super({});
                this._dataArray = dataArray;
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

            public get type(): KeyTypeEnum {
                if (!this.typeKey) {
                    this.typeKey = new KeyTypeEnum(this.extractString('type') || KeyType.RSA);
                }

                return this.typeKey;
            }

            public typeData(): Record<string, unknown> {
                return this.extractArray(this.type.value());
            }

            public isType(type: string): boolean {
                return this.type.value() === type;
            }
        }
);
