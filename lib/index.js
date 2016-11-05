'use strict'

const Writable = require('stream').Writable
const assert = require('assert')
const ms = require('ms')

module.exports = (options) => {
  const limit = options.limit || 1000
  const interval = typeof options.interval === 'string' ? ms(options.interval)
    : typeof options.interval === 'number' ? options.interval
    : 300
  const onError = typeof options.onError === 'function'
    ? options.onError
    : (err) => console.error(err.stack)
  assert('function', typeof options.flush)

  let intervalId = null
  let buffer = []

  const stream = new Writable({
    objectMode: true,
    write (chunk, NULL, callback) {
      push(chunk)
      callback()
    }
  })

  Object.assign(stream, {
    buffer,
    flush,
    close
  })

  function push (data) {
    const length = buffer.push(data)
    if (length >= limit) {
      flush()
    } else if (!intervalId) {
      resetTimer()
    }
  }

  function flush () {
    resetTimer()

    if (!buffer.length) return Promise.resolve()

    const oldBuffer = buffer
    buffer = []
    return new Promise((resolve) => resolve(options.flush(oldBuffer))).catch(onError)
  }

  function resetTimer () {
    if (intervalId) clearTimeout(intervalId)

    intervalId = setTimeout(flush, interval)
    // because JEST!
    if (stream.closed && typeof intervalId.unref === 'function') {
      intervalId.unref()
    }
  }

  function close () {
    stream.closed = true
    return flush()
  }

  return stream
}
