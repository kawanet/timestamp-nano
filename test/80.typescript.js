"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var Timestamp = require("../");
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    it("typescript", function () {
        var time = 0;
        var buf = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
        var dt = new Date(time * 1000);
        var str = "1970-01-01T00:00:00.000000000Z";
        var json = "1970-01-01T00:00:00.000Z";
        // static methods
        assert.strictEqual(Timestamp.fromDate(dt).toString(), str);
        assert.strictEqual(Timestamp.fromDate(dt).toString(), str);
        assert.strictEqual(Timestamp.fromInt64BE(buf).toString(), str);
        assert.strictEqual(Timestamp.fromInt64LE(buf).toString(), str);
        assert.strictEqual(Timestamp.fromString(str).toString(), str);
        assert.strictEqual(Timestamp.fromTimeT(time).toString(), str);
        // instance
        var ts = new Timestamp(0);
        assert(ts instanceof Timestamp);
        assert.strictEqual(typeof ts.getNano, "function");
        assert.strictEqual(typeof ts.getTimeT, "function");
        assert.strictEqual(typeof ts.getYear, "function");
        assert.strictEqual(typeof ts.toDate, "function");
        assert.strictEqual(typeof ts.toJSON, "function");
        assert.strictEqual(typeof ts.toString, "function");
        assert.strictEqual(typeof ts.writeInt64BE, "function");
        assert.strictEqual(typeof ts.writeInt64LE, "function");
        // methods
        assert.strictEqual(ts.getNano(), 0);
        assert.strictEqual(ts.getTimeT(), 0);
        assert.strictEqual(ts.getYear(), 1970);
        assert.strictEqual(+ts.toDate(), +dt);
        assert.strictEqual(ts.toJSON(), json);
        assert.strictEqual(ts.toString(), str);
    });
});
