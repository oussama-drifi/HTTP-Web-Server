import url from 'url'
import path from 'path'

export const getFileName = () => url.fileURLToPath(import.meta.url)
export const getDirName = (file) => path.dirname(file)