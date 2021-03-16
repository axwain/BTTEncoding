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
  '}'
]

const DecodingAlphabet = {}
Alphabet.forEach((x, i) => DecodingAlphabet[x] = i)

const B85 = 85
const B85_2 = B85 * 85
const B85_3 = B85_2 * 85
const B85_4 = B85_3 * 85

export const StringToInt = (text, start = 0) => {
  if (text.length === 0) {
    throw new Error('String should not be empty')
  }

  let shiftedBits = 24
  let integer = 0
  for(let i = start; i < text.length && shiftedBits >= 0; i++, shiftedBits -= 8) {
    integer += text.codePointAt(i) << shiftedBits
  }
  return integer
}

const IntToString = (integer) => {
  return String.fromCodePoint(
    (integer & 0xFF000000) >> 24,
    (integer & 0x00FF0000) >> 16,
    (integer & 0x0000FF00) >> 8,
    integer & 0x000000FF
  )
}

export const Encode = (text) => {
  let Result = ''
  for(let i = 0; i < text.length; i += 4) {
    const CharactersLeft = text.length - i
    const Number = StringToInt(text, i)
    Result += Alphabet[Math.floor(Number / B85_4) % B85]
    
    Result += Alphabet[Math.floor(Number / B85_3) % B85]

    if (CharactersLeft > 1) {
      Result += Alphabet[Math.floor(Number / B85_2) % B85]
    }

    if (CharactersLeft > 2) {
      Result += Alphabet[Math.floor(Number / B85) % B85]
    }

    if (CharactersLeft > 3) {
      Result += Alphabet[Number % B85]
    }
  }

  return Result.replace(/!!!!!/g, '|')
}

export const Decode = (text) => {
  let Result = ''
  let ExpandedText = text.replace(/\|/g, '!!!!!')
  const CharactersLeft = ExpandedText.length % 5
  let Padding = 0
  if (CharactersLeft > 0) {
    while(Padding < 5 - CharactersLeft) {
      ExpandedText += Alphabet[84]
      Padding++
    }
  }
  for(let i = 0; i < ExpandedText.length; i += 5) {
    let Number = DecodingAlphabet[ExpandedText[i]] * B85_4
    Number += DecodingAlphabet[ExpandedText[i + 1]] * B85_3
    Number += DecodingAlphabet[ExpandedText[i + 2]] * B85_2
    Number += DecodingAlphabet[ExpandedText[i + 3]] * B85
    Number += DecodingAlphabet[ExpandedText[i + 4]]

    Result += IntToString(Number)
  }

  return Result.substring(0, Result.length - Padding)
}
