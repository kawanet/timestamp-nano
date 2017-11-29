/**
 * Timestamp for 64-bit time_t, nanosecond precision and strftime
 *
 * @author Yusuke Kawasaki
 * @license MIT
 * @see https://github.com/kawanet/timestamp-nano
 */

export declare class Timestamp {

    /**
     * @param time - Milliseconds from epoch
     * @param nano - Offset number for nanosecond precision
     * @param year - Offset number for year which must be a multiple of 400 to avoid leap year calculation
     */

    constructor(time: number, nano?: number, year?: number);

    /**
     * Creates a Timestamp instance from Date instance or milliseconds since epoch.
     *
     * @param date - Milliseconds since epoch
     */

    static fromDate(date: Date | number);

    /**
     * Creates a Timestamp instance from big endian 64bit time_t of 8 bytes sequence.
     *
     * @param buffer - Buffer, Array, Uint8Array, etc.
     * @param offset
     */

    static fromInt64BE(time: Array<number> | Uint8Array, offset?: number);

    /**
     * Creates a Timestamp instance from little endian 64bit time_t of 8 bytes sequence.
     *
     * @param buffer - Buffer, Array, Uint8Array, etc.
     * @param offset
     */

    static fromInt64LE(time: Array<number> | Uint8Array, offset?: number);

    /**
     * Creates a Timestamp instance from string like: "2017-11-26T11:27:58.737Z"
     *
     * @see https://www.w3.org/TR/NOTE-datetime
     * @param string - W3C Date and Time Formats
     */

    static fromString(string: string);

    /**
     * Creates a Timestamp instance from seconds since epoch aka time_t.
     *
     * @param time - Seconds since epoch
     */

    static fromTimeT(time: number);

    /**
     * Adds offset in nanosecond precision.
     *
     * @param nano - offset number for nanosecond precision in addition.
     */

    addNano(nano: number): Timestamp;

    /**
     * Returns a number, between 0 and 999999999, representing the nanoseconds.
     */

    getNano(): number;

    /**
     * Returns a number representing the seconds since epoch aka time_t.
     *
     * JavaScript has the Double precision per default.
     * Instead, Call Timestamp#writeInt64BE to retrieve 64bit long long precision time_t.
     */

    getTimeT(): number;

    /**
     * Returns a number representing the year like Date#getUTCFullYear.
     */

    getYear(): number;

    /**
     * Returns a Date instance.
     *
     * Do not call Date#getUTCFullYear nor Date#getFullYear with the Date instance.
     * Any properties other than those two are correct.
     * Instead, Call Timestamp#getYear to retrieve the year as Timestamp has year offset.
     */

    toDate(): Date;

    /**
     * Returns a JSON string representation like: "2017-11-26T11:27:58.737Z"
     */

    toJSON(): string;

    /**
     * Returns a string formatted like strftime does.
     *
     * @param format - "%Y-%m-%dT%H:%M:%S.%NZ", "%a, %b %d %X %Y %z (%Z)", etc.
     */

    toString(format?: string): string;

    /**
     * Writes big endian 64bit time_t of 8 bytes sequence.
     *
     * @param buffer - Buffer, Array, Uint8Array, etc.
     * @param offset
     */

    writeInt64BE(buffer?: Array<number> | Uint8Array, offset?: number): Array<number> | Uint8Array;

    /**
     * Writes little endian 64bit time_t of 8 bytes sequence.
     *
     * @param buffer - Buffer, Array, Uint8Array, etc.
     * @param offset
     */

    writeInt64LE(buffer?: Array<number> | Uint8Array, offset?: number): Array<number> | Uint8Array;
}
