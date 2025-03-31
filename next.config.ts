/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	serverExternalPackages: ['onnxruntime-node'],
}

module.exports = nextConfig
