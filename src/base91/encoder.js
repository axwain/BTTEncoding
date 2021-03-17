const Alphabet = [
  '!',
  '#',
  '$',
  '%',
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  ':',
  ';',
  '=',
  '?',
  '@',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '[',
  ']',
  '^',
  '_',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '{',
  '|',
  '}',
  '~',
  'Ç',
  'ü',
  'é',
  'â'
]

const DecodingAlphabet = {}
Alphabet.forEach((x, i) => { DecodingAlphabet[x] = i })

export const Encode = (text) => {
  let n = 0
  let block = 0
  let result = ''
  const AddBlock = () => {
    const X = block & 8191
    result += Alphabet[Math.floor(X / 91)]
    result += Alphabet[X % 91]
  }
  for (let i = 0; i < text.length; i++) {
    block += (text.codePointAt(i) << n)
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
    result += Alphabet[Padding]
  }

  return result
}

export const Decode = (text) => {
  let length = text.length
  let padding = 0
  let block = 0
  let n = 0
  let result = ''
  if (length % 2 === 1) {
    length--
    padding = DecodingAlphabet[text[length]]
    length -= 2
  }

  const AddBlock = (index) => {
    block += (DecodingAlphabet[text.charAt(index)] * 91 + DecodingAlphabet[text.charAt(index + 1)] << n)
    n += 13
  }

  const AddResult = () => {
    result += String.fromCodePoint(block & 0xFF)
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

  return result
}
