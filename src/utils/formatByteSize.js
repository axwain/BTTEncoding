export function formatByteSize (bytes) {
  if (bytes < 1024) return bytes + ' bytes'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KB'
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MB'
  else return (bytes / 1073741824).toFixed(3) + ' GB'
}
