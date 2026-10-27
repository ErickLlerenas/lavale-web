/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/email/bienvenida.html", destination: "/#descargar", permanent: true },
    ];
  },
};

export default nextConfig;
