// TypeScript type definitions

declare class Timestamp {
    constructor(time: number, nano: number, year: number);

    static fromDate(date: Date | number);

    static fromInt64BE(time: ArrayLike, offset?: number);

    static fromInt64LE(time: ArrayLike, offset?: number);

    static fromString(string: string);

    static fromTimeT(time: number);

    addNano(): Timestamp;

    getNano(): number;

    getTimeT(): number;

    getYear(): number;

    toDate(): Date;

    toJSON(): string;

    toString(format?: string): string;

    writeInt64BE(buffer?: ArrayLike, offset?: number): ArrayLike;

    writeInt64LE(buffer?: ArrayLike, offset?: number): ArrayLike;
}
