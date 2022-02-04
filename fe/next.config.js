/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_NAME: `mern-auth`,
    REACT_APP_ENV: `development`,
    REACT_APP_URL: `http://localhost:3000`,
    REACT_APP_PORT: 3000,
    REACT_APP_API_URL: `http://localhost:3001/api/v1`,
    REACT_APP_ASSETS_URL: `http://localhost:3001`
  }
}

module.exports = nextConfig
