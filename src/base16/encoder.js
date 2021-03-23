import { Alphabet as DecodingAlphabet } from './constants.js'
const EncodingAlphabet = []
Object.keys(DecodingAlphabet)
  .sort((a, b) => { return DecodingAlphabet[a] - DecodingAlphabet[b] })
  .forEach(key => EncodingAlphabet.push(key))

export const Encode16 = (byteArray) => {
  let result = ''

  const AddResult = (number) => {
    result += EncodingAlphabet[number]
  }

  for (let i = 0; i < byteArray.length; i++) {
    AddResult(byteArray[i] & 0xF)
    AddResult(byteArray[i] >> 4)
  }

  return result
}
