import { readFileSync, writeFileSync } from 'fs'
import { opendir } from 'fs/promises'
import { join } from 'path'

import { max, mean, sampleVariance } from 'simple-statistics'
import colors from 'colors/safe.js'

import { Encode16 } from '../base16/encoder.js'
import { Encode32 } from '../base32/encoder.js'
import { Encode85 } from '../base85/encoder.js'
import { Encode91 } from '../base91/encoder.js'
import { buildHuffmanTree, encode, getHuffmanCodes, getHuffmanSymbolMap } from '../huffman/encoder.js'
import { formatByteSize } from '../utils/formatByteSize.js'

function Encode64 (buffer) {
  return buffer.toString('base64')
}

function EncodeFunc (encoder) {
  return (buffer) => {
    const Data = encoder(buffer)
    return { data: Buffer.from(Data), size: Data.length }
  }
}

function EncodeHuffman (buffer) {
  const Tree = buildHuffmanTree(buffer)
  const Codes = getHuffmanCodes(Tree)
  const SymbolsSize = JSON.stringify(getHuffmanSymbolMap(Tree)).length
  const Data = encode(buffer, Codes)
  return { data: Buffer.from(Data), size: Data.length + SymbolsSize }
}

const Huffman = 'Huffman'

const Encoders = {
  Base16: EncodeFunc(Encode16),
  Base32: EncodeFunc(Encode32),
  Base64: EncodeFunc(Encode64),
  Base85: EncodeFunc(Encode85),
  Base91: EncodeFunc(Encode91)
}

const EncodersKeys = Object.keys(Encoders)
const Cases = []

for (const Key of EncodersKeys) {
  Cases.push(Key)
  Cases.push(`${Key} + ${Huffman}`)
  for (const SecondKey of EncodersKeys) {
    Cases.push(`${Key} + ${Huffman} + ${SecondKey}`)
  }
}

Cases.push(Huffman)

function processFile (filepath) {
  const Data = []
  const File = readFileSync(filepath)

  for (const Key of EncodersKeys) {
    const BaseEncoded = Encoders[Key](File)
    const HuffmanCoded = EncodeHuffman(BaseEncoded.data)
    Data.push(BaseEncoded.size)
    Data.push(HuffmanCoded.size)
    for (const SecondKey of EncodersKeys) {
      Data.push(Encoders[SecondKey](HuffmanCoded.data).size)
    }
  }

  Data.push(EncodeHuffman(File).size)

  Data.push(File.byteLength)
  Data.push(filepath)

  return Data
}

function ComputeBenchMarkResults (data) {
  const FileSizeKey = Cases.length
  let result = 'Strategy,Mean,Variance,Max\n'
  for (let i = 0; i < Cases.length; i++) {
    const Column = []
    for (const Row of data) {
      Column.push(Row[i] * 100 / Row[FileSizeKey])
    }
    result += `${Cases[i]},${mean(Column).toFixed(3)},${sampleVariance(Column).toFixed(3)},${max(Column).toFixed(3)}\n`
    Column.length = 0
  }

  return result
}

function DataToString (data) {
  const FileSizeKey = Cases.length
  const FilePathKey = Cases.length + 1
  let sizeTable = 'File,Size,' + Cases.map(k => `${k} bytes`).join() + '\n'
  let percentageTable = '\n\nFile,' + Cases.map(k => `${k} %`).join() + '\n'
  for (const Row of data) {
    const FilePath = Row[FilePathKey]
    const FileSize = Row[FileSizeKey]
    const Sizes = Row.map(c => c).splice(0, FileSizeKey)
    sizeTable += `${FilePath},${formatByteSize(FileSize)},${Sizes.map(c => `${formatByteSize(c)}`).join()}\n`
    percentageTable += `${FilePath},${Sizes.map(c => `${(c * 100 / FileSize).toFixed(3)}`).join()}\n`
  }
  return sizeTable + percentageTable
}

async function benchmark (path) {
  const Regex = /\.place*/i
  const Files = []
  try {
    console.info(colors.black.bold('>Getting Asset File List'))
    const Dir = await opendir(path)
    for await (const Dirent of Dir) {
      if (Dirent.isDirectory) {
        const SubDir = await opendir(join(path, Dirent.name))
        for await (const SubDirent of SubDir) {
          if (SubDirent.isFile && !SubDirent.name.match(Regex)) {
            Files.push(join(path, Dirent.name, SubDirent.name))
          }
        }
      }
    }

    // Get File and Encoding Data
    const Data = []
    const StartTime = process.hrtime()
    for (const File of Files) {
      const Start = process.hrtime()
      process.stdout.write(`${colors.cyan.dim.bold('Testing file:')} ${File}`)
      Data.push(processFile(File))
      process.stdout.write(colors.cyan.dim(`... Done in ${process.hrtime(Start)}s\n`))
    }
    process.stdout.write(colors.cyan.dim(`All encoding done in ${process.hrtime(StartTime)}s\n`))

    console.info(colors.cyan.dim('Computing Results...'))
    const Results = ComputeBenchMarkResults(Data)
    const Table = DataToString(Data)

    console.info(colors.yellow.dim.bold('Writing Results...'))
    writeFileSync('encodingBenchmarkResults.csv', Results)
    writeFileSync('encodingBenchmarkDataTable.csv', Table)
    console.info(colors.green.dim('Benchmark complete...'))
  } catch (error) {
    console.error(error)
  }
}

benchmark('./assets').then(() => { console.log('Finished') })
