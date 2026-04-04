import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://ik.imagekit.io/campu/**')],
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
