import { platform } from 'node:os'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16: при наличии кастомного `webpack` нужен ключ (даже пустой), иначе конфликт с Turbopack по умолчанию
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // См. `npm run dev:webpack` — на Windows иногда нужен Webpack + poll; обычный `npm run dev` = Turbopack (быстрее)
  webpack: (config, { dev }) => {
    if (dev && platform() === 'win32') {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1500,
        aggregateTimeout: 500,
      }
    }
    return config
  },
}

export default nextConfig
