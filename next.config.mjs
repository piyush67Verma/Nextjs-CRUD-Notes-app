/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
};
// const nextConfig = {
//   experimental: {
//     esmExternals: 'loose',
//     serverComponentsExternalPackages: ['mongoose'],
//   },
//   webpack: (config) => {
//     config.experiments = { topLevelAwait: true };
//     return config;
//   },
// };


export default nextConfig;
