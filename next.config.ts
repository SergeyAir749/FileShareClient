import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb',
    },
  },
};

export default nextConfig;

// const withNextIntl = createNextIntlPlugin('./src/translations/i18n.ts');

// import {NextConfig} from 'next';
// import createNextIntlPlugin from 'next-intl/plugin';
 
// const nextConfig: NextConfig = {};
 
// export default withNextIntl(nextConfig);