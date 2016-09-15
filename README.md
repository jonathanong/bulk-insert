# Asymmetrical Signing

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

A writable stream that batches.

## Example

```js
const createBulk = require('bulk-insert')

const onError = (err) => {
  if (err) console.error(err.stack || err)
}

const writable = createBulk({
  limit: 500, // maximum # of documents to insert at one time
  interval: '0.5s', // minimum interval between flushes,
  onError,
  flush (data) {
    // `data` will be an array
    kinesis.putRecords({
      Records: data.map((x) => ({
        Data: JSON.stringify(x),
        PartitionKey: 'some_key'
      })),
      StreamName: 'some_stream_name'
    }, onError)
  }
})

writable.write({
  some: 'data'
})

writable.write({
  some: 'more data'
})
```

[npm-image]: https://img.shields.io/npm/v/bulk-insert.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bulk-insert
[travis-image]: https://img.shields.io/travis/jonathanong/bulk-insert/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/jonathanong/bulk-insert
[codecov-image]: https://img.shields.io/codecov/c/github/jonathanong/bulk-insert/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/jonathanong/bulk-insert
[david-image]: http://img.shields.io/david/jonathanong/bulk-insert.svg?style=flat-square
[david-url]: https://david-dm.org/jonathanong/bulk-insert
[license-image]: http://img.shields.io/npm/l/bulk-insert.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/bulk-insert.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/bulk-insert
