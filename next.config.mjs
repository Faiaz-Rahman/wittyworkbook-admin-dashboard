/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'www.mathworksheets4kids.com',
      port: '',
      pathname: '/worksheets/**'
    }]
  },
}

export default nextConfig
