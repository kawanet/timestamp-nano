#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TITLE = __filename.split("/").pop();

describe(TITLE, function() {
  var Timestamp = require("../timestamp");

  var TZ = {
    UTC: "Z",
    GMT: "+00:00",
    PST: "-08:00",
    JST: "+09:00",
    NST: "-03:30",
    IST: "+05:30"
  };

  var TIME = [
    // epoch
    "1970-01-01T00:00:00.001Z",
    "1969-12-31T23:59:59.999Z",

    // leap year
    "2020-02-28T23:59:59.999Z",
    "2020-02-29T00:00:00.001Z",

    // BC1
    "0000-01-01T00:00:00.001Z",

    // far future
    "+099999-12-31T23:59:59.999Z",
    "+100000-01-01T00:00:00.001Z"
  ];

  Object.keys(TZ).forEach(function(name) {
    var tz = TZ[name];
    var title = getJSON(TIME[0], tz) + " (" + name + ")";

    it(title, function() {
      TIME.forEach(function(time) {
        var json = getJSON(time, tz);
        var dt = new Date(json);

        var ts = Timestamp.fromString(json);
        assert.equal(+ts.toDate(), +dt, json);

        var nocollon = json.replace(/:(\d+)$/, "$1");
        ts = Timestamp.fromString(nocollon);
        assert.equal(+ts.toDate(), +dt, json);
      });
    });
  });

  function getJSON(time, tz) {
    return time.replace(/Z$/, tz);
  }
});