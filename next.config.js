/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ibb.co.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ibb.co', port: '', pathname: '/**' },
    ],
  },
};
export default nextConfig;
