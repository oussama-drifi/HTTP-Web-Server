import url from 'url'
import path from 'path'

export const getFileName = (metaUrl) => url.fileURLToPath(metaUrl)
export const getDirName = (file) => path.dirname(file)