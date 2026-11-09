import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // L'image Docker définit NEXT_OUTPUT=standalone : l'exécution n'embarque que le nécessaire.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
