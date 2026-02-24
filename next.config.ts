import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark server-only packages to avoid client bundle issues
  serverExternalPackages: ['@supabase/supabase-js', 'openai'],
};

export default nextConfig;
