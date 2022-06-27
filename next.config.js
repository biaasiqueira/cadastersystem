/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
    reactStrictMode: true,
}

module.exports = {
    nextConfig,
    lessLoaderOptions: {
        javascriptEnabled: true,

    },
}
