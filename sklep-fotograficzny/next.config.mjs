/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingIncludes: {
        '/api/**/*': ['./generated/**/*'],
        '/**/*': ['./generated/**/*'],
    },

    webpack: (config) => {
        config.externals.push({
            '@/generated/prisma': 'commonjs ./generated/prisma/index.js',
        });
        return config;
    },
};

export default nextConfig;