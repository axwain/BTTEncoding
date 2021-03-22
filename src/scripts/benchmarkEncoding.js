import { readFileSync, writeFileSync } from 'fs'
import { opendir } from 'fs/promises'
import { join } from 'path'

import { max, mean, sampleVariance } from 'simple-statistics'
import colors from 'colors/safe.js'

import { Encode85 } from '../base85/encoder.js'
import { Encode91 } from '../base91/encoder.js'
import { buildHuffmanTree, encode, getHuffmanCodes, getHuffmanSymbolMap } from '../huffman/encoder.js'
import { formatByteSize } from '../utils/formatByteSize.js'

function Encode64 (buffer) {
  return buffer.toString('base64')
}

function EncodeHuffman (buffer) {
  const Tree = buildHuffmanTree(buffer)
  const Codes = getHuffmanCodes(Tree)
  const SymbolsSize = JSON.stringify(getHuffmanSymbolMap(Tree)).length * 4
  return { data: encode(buffer, Codes), symbolsSize: SymbolsSize }
}

function getSize (array) {
  return array.data ? (array.data.length + array.symbolsSize) : (array.length)
}

function processFile (filepath) {
  const Data = []
  const File = readFileSync(filepath)

  const Push = (array) => Data.push(getSize(array))

  const HuffmanCoded = EncodeHuffman(File)

  const B64 = Encode64(File)
  const B85 = Encode85(File)
  const B91 = Encode91(File)
  const B64Huff = EncodeHuffman(Buffer.from(B64))
  const B85Huff = EncodeHuffman(Buffer.from(B85))
  const B91Huff = EncodeHuffman(Buffer.from(B91))
  const B64HuffB64 = Encode64(Buffer.from(B64Huff.data))
  const B85HuffB64 = Encode64(Buffer.from(B85Huff.data))
  const B91HuffB64 = Encode64(Buffer.from(B91Huff.data))
  const B64HuffB85 = Encode85(Buffer.from(B64Huff.data))
  const B85HuffB85 = Encode85(Buffer.from(B85Huff.data))
  const B91HuffB85 = Encode85(Buffer.from(B91Huff.data))
  const B64HuffB91 = Encode91(Buffer.from(B64Huff.data))
  const B85HuffB91 = Encode91(Buffer.from(B85Huff.data))
  const B91HuffB91 = Encode91(Buffer.from(B91Huff.data))
  const HuffB64 = Encode64(Buffer.from(HuffmanCoded.data))
  const HuffB85 = Encode85(HuffmanCoded.data)
  const HuffB91 = Encode91(HuffmanCoded.data)

  Push(B64)
  Push(B85)
  Push(B91)
  Push(B64Huff)
  Push(B85Huff)
  Push(B91Huff)
  Push(B64HuffB64)
  Push(B85HuffB64)
  Push(B91HuffB64)
  Push(B64HuffB85)
  Push(B85HuffB85)
  Push(B91HuffB85)
  Push(B64HuffB91)
  Push(B85HuffB91)
  Push(B91HuffB91)
  Push(HuffB64)
  Push(HuffB85)
  Push(HuffB91)

  Data.push(File.byteLength)
  Data.push(filepath)

  return Data
}

const FileSizeKey = 18
const FilePathKey = 19
const Keys = [
  'Base64',
  'Base85',
  'Base91',
  'Base64 + Huffman',
  'Base85 + Huffman',
  'Base91 + Huffman',
  'Base64 + Huffman + Base64',
  'Base85 + Huffman + Base64',
  'Base91 + Huffman + Base64',
  'Base64 + Huffman + Base85',
  'Base85 + Huffman + Base85',
  'Base91 + Huffman + Base85',
  'Base64 + Huffman + Base91',
  'Base85 + Huffman + Base91',
  'Base91 + Huffman + Base91',
  'Huffman + Base64',
  'Huffman + Base85',
  'Huffman + Base91'
]

function ComputeBenchMarkResults (data) {
  let result = 'Method,Mean,Variance,Max\n'
  for (let i = 0; i < Keys.length; i++) {
    const Column = []
    for (const Row of data) {
      Column.push(Row[i] * 100 / Row[FileSizeKey])
    }
    result += `${Keys[i]},${mean(Column).toFixed(3)},${sampleVariance(Column).toFixed(3)},${max(Column).toFixed(3)}\n`
    Column.length = 0
  }

  return result
}

function DataToString (data) {
  let sizeTable = 'File,Size,' + Keys.map(k => `${k} bytes`).join() + '\n'
  let percentageTable = '\n\nFile,' + Keys.map(k => `${k} %`).join() + '\n'
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
