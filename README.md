# Timestamp for 64-bit time_t, nanosecond precision and strftime

JavaScript's native `Date` object has limits at the range for 275 thousand years
and the precision of milliseconds.

### Features

- Long range: 64-bit signed long long `time_t` for 292 billion years.
- High precision: nanosecond.
- Formatter: `strftime` compatible.
- Small: Just 3KB minified.
- No dependencies: no other module required. Portable pure JavaScript.

### Synopsis

```js
var Timestamp = require("timestamp-nano");

Timestamp.fromDate(new Date()).toJSON(); // => "2017-11-26T13:36:22.213Z"

Timestamp.fromString("2017-11-26T13:36:22.213Z").getTimeT(); // => 1511703382

Timestamp.fromTimeT(1511703382).writeInt64BE(); // => [0,0,0,0,90,26,195,86]

Timestamp.fromInt64BE([0,0,0,0,90,26,195,86]).toDate().getUTCHours(); // => 13
```

### Installation

```sh
npm install timestamp-nano --save
```

### GitHub

- [https://github.com/kawanet/timestamp-nano](https://github.com/kawanet/timestamp-nano)

### The MIT License (MIT)

Copyright (c) 2017 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
