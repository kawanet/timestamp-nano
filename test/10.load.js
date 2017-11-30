#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TITLE = __filename.split("/").pop();

describe(TITLE, function() {
  var Timestamp, ts;

  it("require", function() {
    Timestamp = require("../timestamp");
  });

  it("constructor", function() {
    // constructor
    assert.equal(typeof Timestamp, "function");

    // static methods
    assert.equal(typeof Timestamp.fromDate, "function");
    assert.equal(typeof Timestamp.fromInt64BE, "function");
    assert.equal(typeof Timestamp.fromInt64LE, "function");
    assert.equal(typeof Timestamp.fromString, "function");
    assert.equal(typeof Timestamp.fromTimeT, "function");

    // call constructor with new
    ts = new Timestamp();
    assert.ok(ts instanceof Timestamp);

    // call constructor without new
    ts = Timestamp();
    assert.ok(ts instanceof Timestamp);
  });

  it("methods", function() {
    // instance methods
    assert.equal(typeof ts.addNano, "function");
    assert.equal(typeof ts.getNano, "function");
    assert.equal(typeof ts.getTimeT, "function");
    assert.equal(typeof ts.getYear, "function");
    assert.equal(typeof ts.toDate, "function");
    assert.equal(typeof ts.toJSON, "function");
    assert.equal(typeof ts.toString, "function");
    assert.equal(typeof ts.writeInt64BE, "function");
    assert.equal(typeof ts.writeInt64LE, "function");

    // return value type
    assert.equal(typeof ts.addNano(0), "object");
    assert.equal(typeof ts.getNano(), "number");
    assert.equal(typeof ts.getTimeT(), "number");
    assert.equal(typeof ts.getYear(), "number");
    assert.equal(typeof ts.toDate(), "object");
    assert.equal(typeof ts.toJSON(), "string");
    assert.equal(typeof ts.toString(), "string");
    assert.equal(typeof ts.writeInt64BE(), "object");
    assert.equal(typeof ts.writeInt64LE(), "object");

    assert.ok(ts.addNano(0) instanceof Timestamp);
    assert.ok(ts.toDate() instanceof Date);
  });
});