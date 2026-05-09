// import type { NextConfig } from "next";

// import { securityHeaders } from "./config/security";
// import { customHeaders } from "./config/headers";
// import { imageConfig } from "./config/images";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,

//   poweredByHeader: false,

//   compress: true,

//   images: imageConfig,

//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           ...securityHeaders,
//           ...customHeaders,
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
  },
};

export default nextConfig;
