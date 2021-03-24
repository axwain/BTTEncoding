import { opendir } from 'fs/promises'
import { join } from 'path'

export async function getAssetList (path, excludeRegex) {
  const Dir = await opendir(path)
  const Files = []
  for await (const Dirent of Dir) {
    if (Dirent.isDirectory) {
      const SubDir = await opendir(join(path, Dirent.name))
      for await (const SubDirent of SubDir) {
        if (SubDirent.isFile && !SubDirent.name.match(excludeRegex)) {
          Files.push(join(path, Dirent.name, SubDirent.name))
        }
      }
    }
  }

  return Files
}
