/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-import-module-exports, import/extensions
// import "./src/lib/env.mjs";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
