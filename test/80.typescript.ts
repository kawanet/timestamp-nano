import * as assert from "assert";
import Timestamp = require("../");

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    it("typescript", () => {
        const time = 0;
        const buf = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
        const dt = new Date(time * 1000);
        const str = "1970-01-01T00:00:00.000000000Z";
        const json = "1970-01-01T00:00:00.000Z";

        // static methods
        assert.equal(Timestamp.fromDate(dt).toString(), str);
        assert.equal(Timestamp.fromDate(dt).toString(), str);
        assert.equal(Timestamp.fromInt64BE(buf).toString(), str);
        assert.equal(Timestamp.fromInt64LE(buf).toString(), str);
        assert.equal(Timestamp.fromString(str).toString(), str);
        assert.equal(Timestamp.fromTimeT(time).toString(), str);

        // instance
        const ts = new Timestamp(0);
        assert(ts instanceof Timestamp);
        assert.equal(typeof ts.getNano, "function");
        assert.equal(typeof ts.getTimeT, "function");
        assert.equal(typeof ts.getYear, "function");
        assert.equal(typeof ts.toDate, "function");
        assert.equal(typeof ts.toJSON, "function");
        assert.equal(typeof ts.toString, "function");
        assert.equal(typeof ts.writeInt64BE, "function");
        assert.equal(typeof ts.writeInt64LE, "function");

        // methods
        assert.equal(ts.getNano(), 0);
        assert.equal(ts.getTimeT(), 0);
        assert.equal(ts.getYear(), 1970);
        assert.equal(+ts.toDate(), +dt);
        assert.equal(ts.toJSON(), json);
        assert.equal(ts.toString(), str);
    });
});