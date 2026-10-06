/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const projectPath = dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  output: 'export',
  turbopack: {
    root: projectPath,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
