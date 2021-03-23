import { Alphabet } from './constants.js'

export const Decode16 = (text) => {
  const result = []

  for (let i = 0; i < text.length; i += 2) {
    result.push(Alphabet[text.charAt(i)] + (Alphabet[text.charAt(i + 1)] << 4))
  }

  return Uint8Array.from(result)
}
