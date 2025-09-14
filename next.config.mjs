/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix for GitHub Pages with custom domain
  trailingSlash: true,
  output: 'export',
}

export default nextConfig
