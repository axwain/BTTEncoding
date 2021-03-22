import { Alphabet } from './constants.js'

export const Decode91 = (text) => {
  let length = text.length
  let padding = 0
  let block = 0
  let n = 0
  const result = []
  if (length % 2 === 1) {
    length--
    padding = Alphabet[text[length]]
    length -= 2
  }

  const AddBlock = (index) => {
    block += (Alphabet[text.charAt(index)] * 91 + Alphabet[text.charAt(index + 1)] << n)
    n += 13
  }

  const AddResult = () => {
    result.push(block & 0xFF)
    block = block >> 8
  }

  for (let i = 0; i < length; i += 2) {
    AddBlock(i)
    while (n >= 8) {
      AddResult()
      n -= 8
    }
  }

  if (padding > 0) {
    AddBlock(length)
    do {
      AddResult()
      n -= 8
    } while (n - padding >= 8)
  }

  return Uint8Array.from(result)
}
