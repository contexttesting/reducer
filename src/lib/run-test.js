import run from './run'
import { dumpResult } from '.'

const NOTIFY = () => {}

/**
 * Run the test (wrapped around notify)
 * @param {{ name: string, context: ContextConstructor, fn: function, timeout?: number }} param1
 * @param {function} notify - notify function
 */
async function runTest({
  name, context, fn, timeout,
}, notify = NOTIFY) {
  notify({
    name,
    type: 'test-start',
  })
  const res = await run({
    fn,
    context,
    timeout,
  })
  const { error } = res
  notify({
    // test,
    name,
    error,
    type: 'test-end',
    result: dumpResult({ error, name }),
  })
  return res
}

export default runTest