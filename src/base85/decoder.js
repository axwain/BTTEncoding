import { Alphabet, B85, B85_2, B85_3, B85_4, LastSymbol } from './constants.js'

export const Decode85 = (text) => {
  const Result = []
  let ExpandedText = text.replace(/\|/g, '!!!!!')
  const CharactersLeft = ExpandedText.length % 5
  let Padding = 0
  if (CharactersLeft > 0) {
    while (Padding < 5 - CharactersLeft) {
      ExpandedText += LastSymbol
      Padding++
    }
  }
  for (let i = 0; i < ExpandedText.length; i += 5) {
    let Number = Alphabet[ExpandedText[i]] * B85_4
    Number += Alphabet[ExpandedText[i + 1]] * B85_3
    Number += Alphabet[ExpandedText[i + 2]] * B85_2
    Number += Alphabet[ExpandedText[i + 3]] * B85
    Number += Alphabet[ExpandedText[i + 4]]

    Result.push((Number & 0xFF000000) >> 24)
    Result.push((Number & 0x00FF0000) >> 16)
    Result.push((Number & 0x0000FF00) >> 8)
    Result.push(Number & 0x000000FF)
  }

  return Uint8Array.from(Result.slice(0, Result.length - Padding))
}
