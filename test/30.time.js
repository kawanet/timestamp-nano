#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TITLE = __filename.split("/").pop();

describe(TITLE, function() {
  var Timestamp = require("../timestamp");
  var DAY = 24 * 3600; // seconds per 1 day

  var SECONDS = [
    0,
    1,
    60,
    3600,
    DAY,
    31 * DAY // 1 month
  ];

  describe("timeT after epoch", function() {
    SECONDS.forEach(function(sec) {
      runTest(sec, 0);
    });

    for (var r = 28; r <= 32; r++) {
      var c = Math.pow(2, r);
      runTest(c - 1, 0);
      runTest(c, 0);
      runTest(c + 1, 0);
    }
  });

  describe("timeT before epoch", function() {
    SECONDS.forEach(function(sec) {
      if (!sec) return;
      runTest(-sec, 0);
    });

    for (var r = 28; r <= 31; r++) {
      var c = -Math.pow(2, r);
      runTest(c + 1, 0);
      runTest(c, 0);
      runTest(c - 1, 0);
    }
  });

  function runTest(time) {
    var title = pad8(time);

    var src = new Date(0);
    src.setTime(time * 1000);
    var year = src.getUTCFullYear();
    var json = src.toJSON();
    var nano = ((src % 1000 + 1000) % 1000) * 1000 * 1000;
    title += " " + json;

    it(title, function() {
      var ts = Timestamp.fromTimeT(time);
      assert.equal(ts.toJSON(), json, "toJSON");
      assert.equal(ts.getYear(), year, "getYear");
      assert.equal(ts.getTimeT(), time, "getTimeT");
      assert.equal(ts.getNano(), nano);

      var dt = ts.toDate();
      assert.equal(dt.getUTCFullYear(), src.getUTCFullYear(), "getUTCFullYear");
      assert.equal(dt.getUTCMonth(), src.getUTCMonth(), "getUTCMonth");
      assert.equal(dt.getUTCDate(), src.getUTCDate(), "getUTCDate");
      assert.equal(dt.getUTCDay(), src.getUTCDay(), "getUTCDay");
      assert.equal(dt.getUTCHours(), src.getUTCHours(), "getUTCHours");
      assert.equal(dt.getUTCMinutes(), src.getUTCMinutes(), "getUTCMinutes");
      assert.equal(dt.getUTCSeconds(), src.getUTCSeconds(), "getUTCSeconds");
      assert.equal(dt.getUTCMilliseconds(), src.getUTCMilliseconds(), "getUTCMilliseconds");
    });
  }

  function pad8(v) {
    var s = "";
    if (v < 0) {
      s = "-";
      v = -v;
    }
    v = v.toString(16);
    if (v.length < 8) {
      v = ("000000000" + v).substr(-8);
    }
    return s + v;
  }
});