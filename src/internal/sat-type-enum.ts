enum SatType {
    FIEL = 'FIEL',
    CSD = 'CSD',
}

class SatTypeEnum {
    private readonly type: string;

    constructor(type: string) {
        /* istanbul ignore next */
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

export { SatType, SatTypeEnum };
