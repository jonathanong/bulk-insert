
/* eslint-env jest */

const assert = require('assert')

const createBulk = require('..')

describe('Bulk Insert', () => {
  it('should bulk inserts into one flush', (done) => {
    const bulk = createBulk({
      interval: 10,
      flush (chunks) {
        assert.equal(chunks.length, 3)
        done()
      }
    })

    bulk.write(1)
    bulk.write(2)
    bulk.write(3)
  })

  it('should bulk inserts into multiple flushes', (done) => {
    let i = 0

    const bulk = createBulk({
      interval: '100ms',
      flush (chunks) {
        switch (i++) {
          case 0:
            assert.deepEqual(chunks, [1])
            bulk.write(2)
            break
          case 1:
            assert.deepEqual(chunks, [2])
            done()
          default:
            done(new Error('boom'))
        }
      }
    })

    bulk.write(1)
  })

  describe('when .limit is reached', () => {
    it('should flush() immediately', (done) => {
      let called = false

      setTimeout(() => assert(called))

      const bulk = createBulk({
        limit: 1,
        flush (chunks) {
          assert(!called)
          called = true
          assert.equal(chunks.length, 1)
          done()
        }
      })

      bulk.write(1)
    })
  })

  describe('when `flush()` returns an error', () => {
    describe('when .onError is not set', () => {
      it('should log the errors', (done) => {
        const bulk = createBulk({
          limit: 1,
          flush () {
            setImmediate(done)
            throw new Error('boom')
          }
        })

        bulk.write(1)
      })
    })

    describe('when .onError is set', () => {
      it('should handle errors', (done) => {
        const bulk = createBulk({
          limit: 1,
          flush () {
            throw new Error('boom')
          },
          onError (err) {
            done()
          }
        })

        bulk.write(1)
      })
    })
  })
})
