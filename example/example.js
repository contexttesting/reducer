/* yarn example/ */
import reducer from '../src'

(async () => {
  const res = await reducer({
    text: 'example',
  })
  console.log(res)
})()