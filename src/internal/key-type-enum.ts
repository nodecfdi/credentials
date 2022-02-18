enum KeyType {
    RSA = 'RSA',
    DSA = 'DSA',
    ECDSA = 'ECDSA',
}

class KeyTypeEnum {
    private readonly type: string;

    constructor(type: string) {
        if (/^-?\d+$/.test(type)) {
            throw new SyntaxError('Index Not Found');
        }
        this.type = type;
    }

    public isRSA(): boolean {
        return this.type === KeyType.RSA;
    }

    public isDSA(): boolean {
        return this.type === KeyType.DSA;
    }

    public isECDSA(): boolean {
        return this.type === KeyType.ECDSA;
    }

    public value(): string {
        return this.type;
    }
}

export { KeyTypeEnum, KeyType };
