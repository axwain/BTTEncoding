import { Alphabet as DecodingAlphabet, B85, B85_2, B85_3, B85_4 } from './constants.js'

const EncodingAlphabet = []
Object.keys(DecodingAlphabet).sort().forEach(key => EncodingAlphabet.push(key))

export const ByteToUint = (byteArray, start = 0) => {
  if (byteArray.length === 0) {
    throw new Error('Byte array should not be empty')
  }

  let shiftedBits = 24
  let integer = 0
  for (let i = start; i < byteArray.length && shiftedBits >= 0; i++, shiftedBits -= 8) {
    integer += byteArray[i] << shiftedBits
  }

  // Ensure it is an unsigned integer
  return integer >>> 0
}

export const Encode85 = (byteArray) => {
  let Result = ''
  for (let i = 0; i < byteArray.length; i += 4) {
    const CharactersLeft = byteArray.length - i
    const Number = ByteToUint(byteArray, i)
    Result += EncodingAlphabet[Math.floor(Number / B85_4) % B85]

    Result += EncodingAlphabet[Math.floor(Number / B85_3) % B85]

    if (CharactersLeft > 1) {
      Result += EncodingAlphabet[Math.floor(Number / B85_2) % B85]
    }

    if (CharactersLeft > 2) {
      Result += EncodingAlphabet[Math.floor(Number / B85) % B85]
    }

    if (CharactersLeft > 3) {
      Result += EncodingAlphabet[Number % B85]
    }
  }

  return Result.replace(/!!!!!/g, '|')
}
