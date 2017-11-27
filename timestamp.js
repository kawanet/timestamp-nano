// timestamp.js

var Timestamp = (function() {
  if ("undefined" !== typeof module) module.exports = Timestamp;

  var SEC_DAY = 24 * 3600; // seconds per day
  var YEAR_WINDOW = 2000; // years per window
  var DAY_WINDOW = (365 * 400 + 97) * YEAR_WINDOW / 400; // days per window
  var MSEC_WINDOW = 1000 * SEC_DAY * DAY_WINDOW; // milliseconds per window

  var BIT24 = 0x1000000;
  var BIT32 = 0x10000 * 0x10000;
  var DEC6 = 1000 * 1000;
  var DEC9 = 1000 * 1000 * 1000;
  var ZERO9 = "000000000";

  var DATE_MAX = 8640000000000000; // Date.UTC(1970, 0, 1 + 100000000);
  var DATE_MIN = -8640000000000000; // Date.UTC(1970, 0, 1 - 100000000);

  var trunc = Math.trunc || Math_trunc;
  var P = Timestamp.prototype;

  // static methods
  Timestamp.fromDate = fromDate;
  Timestamp.fromInt64BE = buildFromInt64(0, 1, 2, 3, 0, 4);
  Timestamp.fromInt64LE = buildFromInt64(3, 2, 1, 0, 4, 0);
  Timestamp.fromString = fromString;
  Timestamp.fromTimeT = fromTimeT;

  // private properties
  P.year = 0; // Offset number for year precision
  P.time = 0; // Milliseconds from epoch
  P.nano = 0; // Offset number for nanosecond precision

  // instance methods
  P.addNano = addNano;
  P.getNano = getNano;
  P.getTimeT = getTimeT;
  P.getYear = getYear;
  P.toDate = toDate;
  P.toJSON = toJSON;
  P.toString = toString;
  P.writeInt64BE = buildWriteInt64(0, 1, 2, 3, 0, 4);
  P.writeInt64LE = buildWriteInt64(3, 2, 1, 0, 4, 0);

  var FMT_JSON = "%Y-%m-%dT%H:%M:%S.%NZ";

  var FMT_MONTH = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  var FMT_DAY = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  var FMT_STRING = {
    "%": "%",
    F: "%Y-%m-%d",
    n: "\n",
    R: "%H:%M",
    T: "%H:%M:%S",
    t: "\t",
    X: "%T",
    Z: "GMT",
    z: "+0000"
  };

  return Timestamp;

  /**
   * @class Timestamp
   * @param [time] {number} Milliseconds from epoch
   * @param [nano] {number} Offset number for nanosecond precision
   * @param [year] {number} Offset number for year precision
   * @author Yusuke Kawasaki
   * @license MIT
   * @see https://github.com/kawanet/timestamp-nano/
   */

  function Timestamp(time, nano, year) {
    if (!(this instanceof Timestamp)) return new Timestamp(time, nano, year);
    this.time = +time || 0;
    this.nano = +nano || 0;
    this.year = +year || 0;
  }

  /**
   * Returns a number representing the year like Date#getUTCFullYear.
   *
   * @instance
   * @memberOf Timestamp
   * @return {number}
   */

  function getYear() {
    var year = this.toDate().getUTCFullYear();
    return year + this.year;
  }

  /**
   * Returns a Date instance.
   *
   * @instance
   * @memberOf Timestamp
   * @return {Date}
   */

  function toDate() {
    var ts = this;
    var time = ts.time;
    var nano = ts.nano;

    // normalize nano
    if (nano < 0 || DEC6 < nano) {
      var n = Math.floor(nano / DEC6);
      ts.nano = nano - n * DEC6;
      ts.time = time = time + n;
    }

    // normalize year
    var y = ts.year % YEAR_WINDOW;
    if (y) {
      ts.year -= y;
      ts.time = time = time + (y * MSEC_WINDOW / YEAR_WINDOW);
    }

    // normalize time
    if (time < DATE_MIN || DATE_MAX < time) {
      var w = trunc(time / MSEC_WINDOW);
      ts.year += w * YEAR_WINDOW;
      ts.time = time = time - (w * MSEC_WINDOW);
    }

    var dt = new Date(0);
    dt.setTime(time);
    return dt;
  }

  /**
   * Adds offset in nanosecond precision.
   *
   * @instance
   * @memberOf Timestamp
   * @param nano {number} offset number for nanosecond precision in addition
   * @return {Timestamp}
   */

  function addNano(nano) {
    this.nano += +nano || 0;
    return this;
  }

  /**
   * Returns a number, between 0 and 999999999, representing the nanoseconds.
   *
   * @instance
   * @memberOf Timestamp
   * @return {number}
   */

  function getNano() {
    return ((this.time % 1000) * DEC6 + this.nano + DEC9) % DEC9;
  }

  /**
   * Creates a Timestamp instance from string like: "2017-11-26T11:27:58.737Z"
   *
   * @static
   * @memberOf Timestamp
   * @see https://www.w3.org/TR/NOTE-datetime
   * @param string {string} W3C Date and Time Formats
   * @return {Timestamp}
   */

  function fromString(string) {
    var year, tz;
    var ts = new Timestamp();

    var array = string.replace(/^\s*[+\-]?\d+/, function(match) {
      year = +match;

      // outside of year window
      if (year < -YEAR_WINDOW || YEAR_WINDOW < year) {
        var y = year % YEAR_WINDOW;
        ts.year = year - y;
        year = y;
      }

      // 0000 - 0170 may get confused as 1900 - 2070
      if (0 <= year && year < 170) {
        ts.year -= YEAR_WINDOW;
        year += YEAR_WINDOW;
      }

      return "";
    }).replace(/(?:Z|([\+\-]\d+):?(\d{2}))$/, function(match, hour, min) {
      // time zone
      tz = ((+hour) * 60 + (+min)) * 60000;
      return "";
    }).replace(/\.\d+$/, function(match) {
      // nanoseconds
      ts.nano = +((match + ZERO9).substr(1, 9));
      return "";
    }).split(/\D+/);

    array[0] = year;
    array[1]--; // month starts from 0
    ts.time = Date.UTC.apply(Date, array) + (tz || 0);

    return ts;
  }

  /**
   * Creates a Timestamp instance from Date instance or milliseconds since epoch.
   *
   * @static
   * @memberOf Timestamp
   * @param date {Date|number}
   * @return {Timestamp}
   */

  function fromDate(date) {
    return new Timestamp(+date);
  }

  /**
   * Creates a Timestamp instance from seconds since epoch aka time_t.
   *
   * @static
   * @memberOf Timestamp
   * @param time {number} Seconds since epoch
   * @return {Timestamp}
   */

  function fromTimeT(time) {
    return fromTime(time, 0);
  }

  /**
   * @private
   */

  function fromTime(low, high) {
    high |= 0;
    high *= BIT32;
    low = +low || 0;
    low += high % SEC_DAY;
    var day = trunc(high / SEC_DAY) + trunc(low / SEC_DAY);
    var year = trunc(day / DAY_WINDOW) * YEAR_WINDOW;
    var time = ((day % DAY_WINDOW) * SEC_DAY + (low % SEC_DAY)) * 1000;
    return new Timestamp(time, 0, year);
  }

  /**
   * Returns a number representing the seconds since epoch aka time_t.
   *
   * @instance
   * @memberOf Timestamp
   * @return {number}
   */

  function getTimeT() {
    var ts = this;
    var time = Math.floor(ts.toDate() / 1000);

    // ts.toDate() make year property normalized
    var year = ts.year;
    if (year) time += year * DAY_WINDOW * SEC_DAY / YEAR_WINDOW;

    // this may loose some bits over than 53 bit precision
    return time;
  }

  /**
   * Returns a JSON string representation like: "2017-11-26T11:27:58.737Z"
   *
   * @instance
   * @memberOf Timestamp
   * @return {string}
   */

  function toJSON() {
    return this.toString().replace(/0{1,6}Z$/, "Z");
  }

  /**
   * Returns a string formatted like strftime.
   *
   * @instance
   * @memberOf Timestamp
   * @param [format] {string} "%Y-%m-%dT%H:%M:%S.%NZ"
   * @return {string}
   */

  function toString(format) {
    var ts = this;
    var dt = ts.toDate();
    var map = {
      H: H,
      L: L,
      M: M,
      N: N,
      S: S,
      Y: Y,
      a: a,
      b: b,
      d: d,
      e: e,
      m: m
    };

    return strftime(format || FMT_JSON);

    function strftime(format) {
      return format.replace(/%./g, function(match) {
        var m = match[1];
        var c = FMT_STRING[m];
        var f = map[m];
        return c ? strftime(c) : f ? f() : match;
      });
    }

    function Y() {
      var year = ts.getYear();
      if (year > 9999) {
        return "+" + pad(year, 6);
      } else if (year >= 0) {
        return pad(year, 4);
      } else if (year >= -999999) {
        return "-" + pad(-year, 6);
      } else {
        return year;
      }
    }

    function m() {
      return pad2(dt.getUTCMonth() + 1);
    }

    function d() {
      return pad2(dt.getUTCDate());
    }

    function e() {
      return padS(dt.getUTCDate());
    }

    function H() {
      return pad2(dt.getUTCHours());
    }

    function M() {
      return pad2(dt.getUTCMinutes());
    }

    function S() {
      return pad2(dt.getUTCSeconds());
    }

    function L() {
      return pad(dt.getUTCMilliseconds(), 3);
    }

    function N() {
      return pad(ts.getNano(), 9);
    }

    function a() {
      return FMT_DAY[dt.getUTCDay()];
    }

    function b() {
      return FMT_MONTH[dt.getUTCMonth()];
    }
  }

  function buildWriteInt64(pos0, pos1, pos2, pos3, posH, posL) {
    return writeInt64;

    /**
     * Writes big endian 64bit time_t of 8 bytes sequence.
     *
     * @method writeInt64BE
     * @instance
     * @memberOf Timestamp
     * @param [buffer] {ArrayLike} Buffer, Array, Uint8Array, etc.
     * @param [offset] {number}
     * @return {ArrayLike}
     */

    /**
     * Writes little endian 64bit time_t of 8 bytes sequence.
     *
     * @method writeInt64LE
     * @instance
     * @memberOf Timestamp
     * @param [buffer] {ArrayLike} Buffer, Array, Uint8Array, etc.
     * @param [offset] {number}
     * @return {ArrayLike}
     */

    function writeInt64(buffer, offset) {
      var ts = this;
      if (!buffer) buffer = [];
      offset |= 0;

      // ts.toDate() make year property normalized
      var second = trunc(ts.toDate() / 1000);
      var day = ts.year * (DAY_WINDOW * SEC_DAY / YEAR_WINDOW);
      var high = trunc(day / BIT32) + trunc(second / BIT32);
      var low = (day % BIT32) + (second % BIT32);

      while (low < 0) {
        low += BIT32;
        high--;
      }

      while (low >= BIT32) {
        low -= BIT32;
        high++;
      }

      writeUint32(buffer, offset + posH, high);
      writeUint32(buffer, offset + posL, low);
      return buffer;
    }

    function writeUint32(buffer, offset, value) {
      buffer[offset + pos0] = (value >> 24) & 255;
      buffer[offset + pos1] = (value >> 16) & 255;
      buffer[offset + pos2] = (value >> 8) & 255;
      buffer[offset + pos3] = value & 255;
    }
  }

  function buildFromInt64(pos0, pos1, pos2, pos3, posH, posL) {
    return fromInt64;

    /**
     * Creates a Timestamp instance from big endian 64bit time_t of 8 bytes sequence.
     *
     * @method fromInt64BE
     * @static
     * @memberOf Timestamp
     * @param buffer {ArrayLike} Buffer, Array, Uint8Array, etc.
     * @param [offset] {number}
     * @return {Timestamp}
     */

    /**
     * Creates a Timestamp instance from little endian 64bit time_t of 8 bytes sequence.
     *
     * @method fromInt64LE
     * @static
     * @memberOf Timestamp
     * @param buffer {ArrayLike} Buffer, Array, Uint8Array, etc.
     * @param [offset] {number}
     * @return {Timestamp}
     */

    function fromInt64(buffer, offset) {
      offset |= 0;
      var high = readUint32(buffer, offset + posH);
      var low = readUint32(buffer, offset + posL);
      return fromTime(low, high);
    }

    function readUint32(buffer, offset) {
      return (buffer[offset + pos0] * BIT24) +
        ((buffer[offset + pos1] << 16) |
          (buffer[offset + pos2] << 8) |
          buffer[offset + pos3]);
    }
  }

  function Math_trunc(x) {
    var n = x - x % 1;
    return n === 0 && (x < 0 || (x === 0 && (1 / x !== 1 / 0))) ? -0 : n;
  }

  function padS(v) {
    return (v > 9 ? "" : " ") + (v | 0);
  }

  function pad2(v) {
    return (v > 9 ? "" : "0") + (v | 0);
  }

  function pad(v, len) {
    return (ZERO9 + (v | 0)).substr(-len);
  }
})();
