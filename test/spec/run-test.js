import { equal, ok } from 'zoroaster/assert'
import * as C from '../context'
import { Readable } from 'stream'
import runTest from '../../src/lib/run-test'
import { strictEqual } from 'assert'

/** @type {Object.<string, (c: C)>} */
const T = {
  context: { ...C },
  async 'runs a test function with contexts'({ c1, c2, NAME }) {
    const { result } = await runTest({
      /**
       * @param {c1} _c1
       * @param {c2} _c2
       */
      fn(_c1, _c2) {
        return `${_c1}-${NAME}-${_c2}`
      },
      context: [c1, c2],
    })
    equal(result, '123-test-456')
  },
  async 'runs a test with persistent context'({ c1, c2, NAME }) {
    const r = await runTest({
      /**
       * @param {c1} _c1
       * @param {c2} _c2
       */
      fn(_c1, _c2) {
        return `${_c1}-${NAME}-${_c2}`
      },
      context: c2,
      persistentContext: c1,
    })
    const { result } = r
    equal(result, '123-test-456')
  },
  async 'runs a test with persistent contexts'({ c1, c2, c3, NAME }) {
    const r = await runTest({
      /**
       * @param {c1} _c1
       * @param {c2} _c2
       */
      fn(_c1, _c3, _c2) {
        return `${_c1}-${NAME}-${_c2} :: ${_c3}`
      },
      context: c2,
      persistentContext: [c1, c3],
    })
    const { result } = r
    equal(result, '123-test-456 :: celebrate life')
  },
  async 'fails test after specified timeout'() {
    const timeout = 100
    const fn = async () => {
      await new Promise(r => setTimeout(r, timeout + 100))
    }
    const { error: { message } } = await runTest({
      fn, timeout,
    })
    const msg = `Test has timed out after ${timeout}ms`
    equal(message, msg)
  },
  async 'runs sync test with a timeout'() {
    const timeout = 100
    const OK = 'ok'
    const fn = () => OK
    const { result, error } = await runTest({
      fn, timeout,
    })
    if (error) throw error
    equal(result, OK)
  },
  async 'runs a test'({ test }) {
    const { error, result, finished, started } = await runTest(test)
    ok(error === null)
    ok(result === undefined)
    ok(finished)
    ok(started)
  },
  async 'saves result of a test'({ test }) {
    const F = 'F'
    const { result } = await runTest({ ...test, fn: () => F })
    equal(result, F)
  },
  async 'runs a test with an error'({ test }) {
    const E = new Error('Test')
    const { result, error } = await runTest({ ...test, fn: () => { throw E } })
    equal(result, null)
    equal(error, E)
  },
}

export const streams = {
  async 'handles streams with result'() {
    let catchmentRes
    const { result } = await runTest({
      fn() {
        return new Readable({
          read() {
            this.push('data')
            this.push(null)
          },
        })
      },
      async onCatchment(catchment) {
        catchmentRes = await catchment.promise
      },
    })
    equal(result, 'data')
    equal(catchmentRes, 'data')
  },
  async 'handles streams with error'() {
    const err = new Error()
    const { error } = await runTest({
      fn() {
        return new Readable({
          read() {
            this.emit('error', err)
            this.push(null)
          },
        })
      },
    })
    strictEqual(error, err)
  },
  async 'can emit error via catchment'() {
    const err = new Error()
    const { error } = await runTest({
      fn() {
        return new Readable({
          read() {
          },
        })
      },
      onCatchment(catchment) {
        catchment.emit('error', err)
      },
    })
    strictEqual(error, err)
  },
}

export default T