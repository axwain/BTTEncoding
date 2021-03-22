import { Alphabet as DecodingAlphabet } from './constants'
const EncodingAlphabet = []
Object.keys(DecodingAlphabet).sort().forEach(key => EncodingAlphabet.push(key))

export const Encode91 = (byteArray) => {
  let n = 0
  let block = 0
  let result = ''
  const AddBlock = () => {
    const X = block & 8191
    result += EncodingAlphabet[Math.floor(X / 91)]
    result += EncodingAlphabet[X % 91]
  }
  for (let i = 0; i < byteArray.length; i++) {
    block += byteArray[i] << n
    n += 8

    if (n >= 13) {
      AddBlock()
      block = block >> 13
      n -= 13
    }
  }

  if (n !== 0) {
    const Padding = 13 - n
    AddBlock()
    result += EncodingAlphabet[Padding]
  }

  return result
}
