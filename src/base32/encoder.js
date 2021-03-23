import { Alphabet as DecodingAlphabet } from './constants.js'
const EncodingAlphabet = []
Object.keys(DecodingAlphabet)
  .sort((a, b) => { return DecodingAlphabet[a] - DecodingAlphabet[b] })
  .forEach(key => EncodingAlphabet.push(key))

export const Encode32 = (byteArray) => {
  let n = 0
  let block = 0
  let result = ''
  const AddBlock = () => {
    const X = block & 31
    result += EncodingAlphabet[X]
  }
  for (let i = 0; i < byteArray.length; i++) {
    block += byteArray[i] << n
    n += 8

    while (n >= 5) {
      AddBlock()
      block = block >> 5
      n -= 5
    }
  }

  if (n !== 0) {
    AddBlock()
  }

  return result
}
