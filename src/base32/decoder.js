import { Alphabet } from './constants.js'

export const Decode32 = (text) => {
  let block = 0
  let n = 0
  const result = []

  for (let i = 0; i < text.length; i++) {
    block += Alphabet[text.charAt(i)] << n
    n += 5
    if (n >= 8) {
      result.push(block & 0xFF)
      block = block >> 8
      n -= 8
    }
  }

  return Uint8Array.from(result)
}
